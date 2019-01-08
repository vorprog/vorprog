# VPN Server Setup

A Virtual Private Network (VPN) is a great way to securely access resources inside your Virtual Private Cloud (VPC).

## Part 1: Set up OpenVpn

OpenVPN is a free open source tool that will let you run a full-on VPN through your Amazon EC2 instance. That means all your internet traffic goes through it, not just your web browser traffic like the proxy above. Desktop programs such as Steam or Spotify work better with this approach.

Note that the following terminal commands use `yum` for installing programs, this is because the default AWS linux AMI is redhat (use something like `apt-get` for debian linux).

Time to connect to the machine via SSH and run some commands!

First, enable access to the Extra Packages for Enterprise Linux (EPEL) repository to allow installation of packages that are not available in standard repositories:
```
sudo amazon-linux-extras install epel
```

Now you can install OpenVPN:
```
sudo yum install -y openvpn
```

These next commands set up IP forwarding, which is necessary for the VPN to work:
```
sudo modprobe iptable_nat
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward
sudo iptables -t nat -A POSTROUTING -s 10.4.0.1/2 -o eth0 -j MASQUERADE
sudo iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE
```

You can setup OpenVPN with static encryption and a .ovpn file. While that works, it only allows one device to be connected at a time, and the fact that you only ever use one key means it’s less secure. Instead, you should use easy-rsa to set up authentication, which is more secure and allows for any number of devices to be simultaneously connected.

## Step 2: Generating Credentials

Easy-rsa is not available in the default yum package list, so we’ll need to enable the EPEL repo to install it:
```
sudo yum install easy-rsa -y --enablerepo=epel
```

Ideally, you would generate all the keys and certificates you need on a separate device from the VPN server for maximum security. However, this can be quite tedious. Instead, you can just generate both client and server credentials on the server, then move the files where you need them from there.

Make an easy-rsa directory in your OpenVPN install directory:
```
sudo mkdir /etc/openvpn/easy-rsa
```
Copy the files from your easy-rsa installation (latest version is 3.0.3 as of time of writing) to the new directory:
```
cd /etc/openvpn/easy-rsa
sudo cp -Rv /usr/share/easy-rsa/3.0.3/* .
```

Now it's time to set up the certificate authority. Start by initializing a new PKI (public key infrastructure) directory and then building a certificate authority keypair:

```
sudo ./easyrsa init-pki
sudo ./easyrsa build-ca
```

Enter a PEM passphrase. This is not required but recommended. If someone gets a hold of your CA somehow, they will not be able to create keys or sign certificates without the password.

You’ll be prompted to enter a common name. Call it whatever you want or just hit Enter to leave it as the default value.

Next, generate a Diffie-Hellman key, which provides perfect forward secrecy:

```
sudo ./easyrsa gen-dh
```

This command can take awhile. It will generate a file called dh.pem. 

Once finished, create the server credentials. (Note: these do not need to password protected but you can if you want even harder security.)

```
sudo ./easyrsa gen-req server nopass
```

Hit Enter to leave the common name as server. 

Once the key pair is generated, sign the certificate:

```
sudo ./easyrsa sign-req server server
```

Type yes to confirm and enter your CA password if you set one earlier.

Now set up the client. (Note: if you want to configure automated VPN startup, it’s best not to set a password.)

```
./easyrsa gen-req client nopass
```

Hit Enter to leave the common name as client. Now sign it:

```
sudo ./easyrsa sign-req client client
```

Type yes to confirm and enter your CA password if you set one.

A TLS key will provide perfect forward secrecy in OpenVPN, which ensures past session data cannot be decrypted even if an attacker gets hold of our private key. Generate a TLS key:

```
cd /etc/openvpn
openvpn --genkey --secret pfs.key
```

All necessary credentials have now been generated.

## Step 3: OpenVPN Server Configuration and Startup

Create an OpenVPN server configuration file, `/etc/openvpn/server.conf`, and add the following to it:

```
port 1194
proto udp
dev tun
ca /etc/openvpn/easy-rsa/pki/ca.crt
cert /etc/openvpn/easy-rsa/pki/issued/server.crt
key /etc/openvpn/easy-rsa/pki/private/server.key
dh /etc/openvpn/easy-rsa/pki/dh.pem
cipher AES-256-CBC
auth SHA512
server 10.8.0.0 255.255.255.0
push "redirect-gateway def1 bypass-dhcp"
push "dhcp-option DNS 8.8.8.8"
push "dhcp-option DNS 8.8.4.4"
ifconfig-pool-persist ipp.txt
keepalive 10 120
comp-lzo
persist-key
persist-tun
status openvpn-status.log
log-append openvpn.log
verb 3
tls-server
tls-auth /etc/openvpn/pfs.key
```

The server is now configured. All that's left to do is to start up OpenVPN. 

OpenVPN should be started as a service so that even after the terminal is closed, it will continue to run until the server is either shut down or the service is manually ended. 

Start OpenVPN as a service:

```
sudo service openvpn start
```

## Step 4: Handle Server Reboot

VPN servers may stop working after a server reboot or maintenance. To prevent this, ensure OpenVPN starts when the server boots:

```
sudo chkconfig openvpn on
```

A script can be used to ensure the necessary routes are set up in iptables to allow OpenVPN traffic. Create `/etc/openvpn/server.sh`, and add the following into it:

```
#!/bin/sh
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward
sudo iptables -t nat -A POSTROUTING -s 10.4.0.1/2 -o eth0 -j MASQUERADE
sudo iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE
```

## Step 5: Setup Client

Now that the server is configured, the client needs to be setup. To do that, the necessary certificate and key files need to be moved from the server to the client device.

First, login as the root user to grant administrative priviliges:

```
sudo su
```

The permissions on these files need to be changed so that they can be accessible. They should also be put in one place to make things a bit easier.

To do this, run the following commands:

```
cd /etc/openvpn
mkdir keys
cp pfs.key keys
cp /etc/openvpn/easy-rsa/pki/dh.pem keys
cp /etc/openvpn/easy-rsa/pki/ca.crt keys
cp /etc/openvpn/easy-rsa/pki/private/ca.key keys
cp /etc/openvpn/easy-rsa/pki/private/client.key keys
cp /etc/openvpn/easy-rsa/pki/issued/client.crt keys
chmod 777 *
```

The last command lowers the required permissions to access these files. It’s important to change them back when finished.

Navigate to  `/etc/openvpn/keys` where you should have six files:

```
client.crt
client.key
ca.crt
dh.pem
pfs.key
ca.key
```

You’ll want to store the ca.key file somewhere safe, such as a USB drive.

As for the other 5 files, download them and put them in the client device's OpenVPN config folder (should be `C:/Program Files/OpenVPN/config`).

Now create a client configuration file (`C:/Program Files/OpenVPN/config/client.ovpn`) and add the following into it:

```
client
dev tun
proto udp
remote THE.EC2.INSTANCE.IP 1194  
ca ca.crt
cert client.crt
key client.key
tls-version-min 1.2
tls-cipher TLS-ECDHE-RSA-WITH-AES-128-GCM-SHA256:TLS-ECDHE-ECDSA-WITH-AES-128-GCM-SHA256:TLS-ECDHE-RSA-WITH-AES-256-GCM-SHA384:TLS-DHE-RSA-WITH-AES-256-CBC-SHA256
cipher AES-256-CBC
auth SHA512
resolv-retry infinite
auth-retry none
nobind
persist-key
persist-tun
ns-cert-type server
comp-lzo
verb 3
tls-client
tls-auth pfs.key
```

Replace `THE.EC2.INSTANCE.IP` with the IP address of the server's EC2 instance.

Note: some OpenVPN clients use the `.conf` extension instead of `.ovpn`.

Run the OpenVPN GUI in administrator mode, right click the icon in your system tray, then connect with the client configuration we just set up. A status screen with loads of text should flash across the screen, and then the icon should turn green.

You are now connected to the VPN, congratulations!

## Step 6: Clean Up

Back on the server, you can also now restore the keys' stricter permissions:

```
cd /etc/openvpn/keys
sudo chmod 600 *
```

The last loose end to tie up is removing the `ca.key` file from the server.

The CA, or certificate authority, is used to sign client certificates. If it is ever compromised, certificates issued by that CA can never be trusted again. While removing this isn’t necessary for the VPN to work, it is strongly recommended (especially if no password was set up for the CA). 

Note: if you do remove `ca.key`, you will have to move that file back on the server to add more keys for new client devices.

After safely storing the CA key somewhere other than the server, remove both the original `ca.key` and the copy:

```
sudo rm /etc/openvpn/easy-rsa/pki/private/ca.key
sudo rm /etc/openvpn/keys/ca.key
```
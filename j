# 0.0.0.0:22 SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.4
Executing: program /usr/bin/ssh host 0.0.0.0, user (unspecified), command scp -v -r -d -t /home/smaug/sites/alexandrie/frontend
OpenSSH_8.9p1 Ubuntu-3ubuntu0.4, OpenSSL 3.0.2 15 Mar 2022
debug1: Reading configuration data /etc/ssh/ssh_config
debug1: /etc/ssh/ssh_config line 19: include /etc/ssh/ssh_config.d/*.conf matched no files
debug1: /etc/ssh/ssh_config line 21: Applying options for *
debug1: Connecting to 0.0.0.0 [0.0.0.0] port 22.
debug1: Connection established.
debug1: identity file deploy_key type 3
debug1: identity file deploy_key-cert type -1
debug1: Local version string SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.4
debug1: Remote protocol version 2.0, remote software version OpenSSH_8.9p1 Ubuntu-3ubuntu0.4
debug1: compat_banner: match: OpenSSH_8.9p1 Ubuntu-3ubuntu0.4 pat OpenSSH* compat 0x04000000
debug1: Authenticating to 0.0.0.0:22 as 'runner'
debug1: load_hostkeys: fopen /home/runner/.ssh/known_hosts2: No such file or directory
debug1: load_hostkeys: fopen /etc/ssh/ssh_known_hosts2: No such file or directory
debug1: SSH2_MSG_KEXINIT sent
debug1: SSH2_MSG_KEXINIT received
debug1: kex: algorithm: curve25519-sha256
debug1: kex: host key algorithm: ssh-ed25519
debug1: kex: server->client cipher: chacha20-poly1305@openssh.com MAC: <implicit> compression: none
debug1: kex: client->server cipher: chacha20-poly1305@openssh.com MAC: <implicit> compression: none
debug1: expecting SSH2_MSG_KEX_ECDH_REPLY
debug1: SSH2_MSG_KEX_ECDH_REPLY received
debug1: Server host key: ssh-ed25519 SHA256:mmbCoOXj0D8HNdQJ3gmsus2NJgjI1oe6t+jC1CXLTvw
debug1: load_hostkeys: fopen /home/runner/.ssh/known_hosts2: No such file or directory
debug1: load_hostkeys: fopen /etc/ssh/ssh_known_hosts2: No such file or directory
debug1: Host '0.0.0.0' is known and matches the ED25519 host key.
debug1: Found key in /home/runner/.ssh/known_hosts:1
debug1: rekey out after 134217728 blocks
debug1: SSH2_MSG_NEWKEYS sent
debug1: expecting SSH2_MSG_NEWKEYS
debug1: SSH2_MSG_NEWKEYS received
debug1: rekey in after 134217728 blocks
debug1: Will attempt key: deploy_key ED25519 SHA256:z/NNbLCDJJn15XOgglfLbetOSMuE7ubRZ/Ve+DTTFcA explicit
debug1: SSH2_MSG_EXT_INFO received
debug1: kex_input_ext_info: server-sig-algs=<ssh-ed25519,sk-ssh-ed25519@openssh.com,ssh-rsa,rsa-sha2-256,rsa-sha2-512,ssh-dss,ecdsa-sha2-nistp256,ecdsa-sha2-nistp384,ecdsa-sha2-nistp521,sk-ecdsa-sha2-nistp256@openssh.com,webauthn-sk-ecdsa-sha2-nistp256@openssh.com>
debug1: kex_input_ext_info: publickey-hostbound@openssh.com=<0>
debug1: SSH2_MSG_SERVICE_ACCEPT received
debug1: Authentications that can continue: publickey,password
debug1: Next authentication method: publickey
debug1: Offering public key: deploy_key ED25519 SHA256:z/NNbLCDJJn15XOgglfLbetOSMuE7ubRZ/Ve+DTTFcA explicit
debug1: Authentications that can continue: publickey,password
debug1: Next authentication method: password
debug1: read_passphrase: can't open /dev/tty: No such device or address
debug1: Authentications that can continue: publickey,password
Permission denied, please try again.
debug1: read_passphrase: can't open /dev/tty: No such device or address
debug1: Authentications that can continue: publickey,password
Permission denied, please try again.
debug1: read_passphrase: can't open /dev/tty: No such device or address
debug1: Authentications that can continue: publickey,password
debug1: No more authentication methods to try.
runner@0.0.0.0: Permission denied (publickey,password).
lost connection
Error: Process completed with exit code 1.
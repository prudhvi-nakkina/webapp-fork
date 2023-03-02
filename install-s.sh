#!/bin/bash

    # Install Node.js

    sleep 30

    sudo yum update -y

    sudo yum install -y gcc-c++ make

    curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
    sudo yum install -y nodejs

    sudo yum install unzip -y
    cd ~/ && mkdir webapp
    sudo mv /home/ec2-user/webapp.zip /home/ec2-user/webapp/webapp.zip
    cd ~/webapp && unzip webapp.zip && npm i

    sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
    # sudo systemctl enable webapp.service
    # sudo systemctl start webapp.service
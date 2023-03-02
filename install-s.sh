#!/bin/bash

    # Install Node.js

    sleep 30

    sudo yum update -y

    sudo yum upgrade -y

    sudo yum install -y gcc-c++ make

    curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
    sudo yum install -y nodejs

    sudo amazon-linux-extras install epel -y

    cd /home/ec2-user && unzip ./webapp.zip

    chmod -R 700 .

    npm install

    sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service
    # sudo systemctl enable webapp.service
    # sudo systemctl start webapp.service
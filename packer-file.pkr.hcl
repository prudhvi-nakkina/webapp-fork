source "amazon-ebs" "amazon-linux-2" {
  access_key    = var.aws_access_key
  secret_key    = var.aws_secret_key
  ami_name      = "amazon-linux-2-node-mysql-ami"
  instance_type = "t2.micro"
  region        = "us-east-1"
  source_ami_filter {
    filters = {
      name                = "amzn2-ami-hvm-2.*.1-x86_64-gp2"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["amazon"]
  }
  ami_users = ["285317072413"]

  ssh_username = "ec2-user"
  ssh_timeout  = "2h"

  associate_public_ip_address = true
}

build {
  sources = ["source.amazon-ebs.amazon-linux-2"]

  provisioner "file" {
    source = "./webapp.zip"
    destination = "/home/ec2-user/webapp.zip"
  }

  provisioner "file" {
    source = "./webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "shell" {
    script = "install-s.sh"
  }
}

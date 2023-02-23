locals {
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}

source "amazon-ebs" "amazon-linux-2" {
  ami_name      = "${var.ami_name}-${local.timestamp}"
  instance_type = var.instance_type
  region        = var.region
  profile       = var.profile
  tags = {
    Name = "${var.ami_name}-${local.timestamp}"
  }
  source_ami_filter {
    filters = {
      name                = var.ami_filter_name
      root-device-type    = var.device_type
      virtualization-type = var.virtual_type
    }
    most_recent = true
    owners      = [var.owner]
  }
  ami_users = [var.ami_user]

  ssh_username = var.ssh_username
  ssh_timeout  = var.ssh_timeout

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
    inline = [
      "echo 'export NODE_ENV=\"${var.NODE_ENV}\"' >> ~/.bash_profile",
      "echo 'export DB_USERNAME=\"${DB_USERNAME}\"' >> ~/.bash_profile",
      "echo 'export DB_PASSWORD=\"${DB_PASSWORD}\"' >> ~/.bash_profile",
      "echo 'export DB_DIALECT=\"${DB_DIALECT}\"' >> ~/.bash_profile",
      "echo 'export PORT=${PORT}' >> ~/.bash_profile",
      "echo 'export DB=\"${DB}\"' >> ~/.bash_profile",
      "echo 'export DB_HOST=\"${DB_HOST}\"' >> ~/.bash_profile",
      "source ~/.bash_profile"
    ]
  }

  provisioner "shell" {
    script = "install-s.sh"
  }
}

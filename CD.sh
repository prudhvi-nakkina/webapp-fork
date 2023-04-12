#!/bin/bash

# Check if DB_USERNAME_SECRET and DB_PASSWORD_SECRET secrets are set
if [[ -z "${LAUNCH_TEMPLATE}" || -z "${ASG}" ]]; then
  echo "Required secrets not set. Aborting script."
else
  # AWS region where the launch template is located
  REGION=us-east-1

  # Name of the launch template to update
  LAUNCH_TEMPLATE_NAME="${LAUNCH_TEMPLATE}"

  # ID of the auto scaling group associated with the launch template
  AUTO_SCALING_GROUP_NAME="${ASG}"

  # New version number for the launch template
  VERSION=$(aws ec2 describe-launch-template-versions --region $REGION --launch-template-name $LAUNCH_TEMPLATE_NAME --query 'max_by(LaunchTemplateVersions, &VersionNumber).VersionNumber' --output text)
  NEW_VERSION=$(($(aws ec2 describe-launch-template-versions --region $REGION --launch-template-name $LAUNCH_TEMPLATE_NAME --query 'max_by(LaunchTemplateVersions, &VersionNumber).VersionNumber' --output text) + 1))
  AMI_ID=$(aws ec2 describe-images --owners self --filters "Name=name,Values=amazon*" --query 'sort_by(Images, &CreationDate)[-1].ImageId')
#   ASG_ID=$(aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names $AUTO_SCALING_GROUP_NAME --query "AutoScalingGroups[0].AutoScalingGroupARN | split(':')[-1]" --output text)
  LAUNCH_TEMPLATE_ID=$(aws ec2 describe-launch-templates --region $REGION --launch-template-names $LAUNCH_TEMPLATE_NAME --query 'LaunchTemplates[0].LaunchTemplateId' --output text)

  # Create a new version of the launch template with updated user data
  aws ec2 create-launch-template-version --region $REGION --launch-template-name $LAUNCH_TEMPLATE_NAME --source-version $VERSION --launch-template-data "ImageId"=$AMI_ID

  # Update the auto scaling group with the new launch template version
  aws autoscaling update-auto-scaling-group --region $REGION --auto-scaling-group-name $AUTO_SCALING_GROUP_NAME --launch-template "LaunchTemplateId=$LAUNCH_TEMPLATE_ID,Version=$NEW_VERSION"

  # Trigger an instance refresh in the auto scaling group
  aws autoscaling start-instance-refresh --region $REGION --auto-scaling-group-name $AUTO_SCALING_GROUP_NAME --preferences '{"InstanceWarmup":300,"MinHealthyPercentage":50}'
fi

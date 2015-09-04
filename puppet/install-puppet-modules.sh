#!/bin/sh

module_path=/vagrant/puppet/modules/forge

mkdir -p "${module_path}"

for module_src in \
                    puppetlabs-rabbitmq \
                    garethr-erlang \
                    puppetlabs-firewall; do

  module="${module_src#*-}"
  if [ ! -d "${module_path}/${module}" ]; then
    echo "Installing puppet module ${module_src}."
    puppet module install --modulepath "${module_path}" "${module_src}"
  fi

done
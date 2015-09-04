Vagrant.configure('2') do |config|

	config.vm.box = 'puppetlabs/centos-6.6-64-puppet'
  config.vm.box_url = 'https://atlas.hashicorp.com/puppetlabs/boxes/centos-6.6-64-puppet'

  if Vagrant.has_plugin?('vagrant-hostmanager')
    config.hostmanager.enabled = true
    config.hostmanager.manage_host = true
    config.hostmanager.ignore_private_ip = false
    config.hostmanager.include_offline = true
  end

  config.vm.define 'rabbitmq' do |rabbitmq|

    config.vm.hostname = 'rabbitmq'

    config.vm.network :private_network, type: 'static', ip: '10.1.1.2'
    config.vm.network :forwarded_port, guest: 5672, host: 5672, auto_correct: true
    config.vm.network :forwarded_port, guest: 15672, host: 15672, auto_correct: true

    if Vagrant.has_plugin?('vagrant-hostmanager')
      config.hostmanager.ip_resolver = proc do |vm, resolving_vm|
        if vm.id
          getIpFromVboxManage(vm.id)
        end
      end
      config.vm.provision :hostmanager
    end

    config.vm.provision :shell, :path   => "puppet/install-puppet-modules.sh"
    config.vm.provision :shell, :inline => 'yum clean all'

    config.vm.provision :puppet do |puppet|
      puppet.manifests_path = 'puppet/manifests'
      puppet.manifest_file = ''
      puppet.hiera_config_path = 'puppet/hiera.yaml'
      puppet.module_path = ['puppet/modules/forge', 'puppet/modules/custom']
    end

    config.vm.provider :virtualbox do |v|
      v.name = 'rabbitmq'
    end

  end
end

# Get the guest IP address from VBoxManage. This is specific to VirtualBox.
# This works for either dhcp or static network types (although is a little
# superfluous if you already know the static IP assignment).
# VBoxManage may take a few seconds to pick up static IP assignments. Loop
# until it does.
def getIpFromVboxManage(id)
  ip=`VBoxManage guestproperty get #{id} "/VirtualBox/GuestInfo/Net/1/V4/IP"`.split()[1]
  if ip !~ /(\d+\.\d+\.\d+\.\d+)/
    puts 'VirtualBox guest IP not set. Retrying...'
    sleep(1)
    getIpFromVboxManage(id)
  else
    return ip
  end
end

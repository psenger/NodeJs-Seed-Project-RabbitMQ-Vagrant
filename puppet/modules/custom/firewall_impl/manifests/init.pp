# modeled after
# https://github.com/puppetlabs-seteam/puppet-module-profile/blob/master/manifests/firewall.pp
class firewall_impl {
  include stdlib::stages

  class { '::firewall': stage => 'setup'  }
  class { '::firewall_impl::pre':  stage => 'setup'  }
  class { '::firewall_impl::post': stage => 'deploy' }

  resources { 'firewall':
    purge   => true
  }

}
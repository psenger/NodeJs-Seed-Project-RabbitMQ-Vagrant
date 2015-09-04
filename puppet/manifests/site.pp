node 'rabbitmq' {

  class { 'erlang': epel_enable => true}

  class { '::rabbitmq':
    repos_ensure      => true,
    version           => '3.5.1-1',
    service_manage    => true,
    port              => '5672',
    delete_guest_user => false,
    admin_enable      => true,
    config_variables  => {
      loopback_users => '[]'
    }
  }

  Class['erlang'] -> Class['rabbitmq']

  firewall { '100 allow rabbitmq':
    chain   => 'INPUT',
    state   => ['NEW'],
    dport   => '5672',
    proto   => 'tcp',
    action  => 'accept',
  }

  firewall { '100 allow rabbitmq management':
    chain   => 'INPUT',
    state   => ['NEW'],
    dport   => '15672',
    proto   => 'tcp',
    action  => 'accept',
  }  

}
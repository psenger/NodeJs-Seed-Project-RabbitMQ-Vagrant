# NodeJS Seed Project for RabbitMQ ( Vagrant )

Written by Philip A Senger

[philip.a.senger@cngrgroup.com](mailto:philip.a.senger@cngrgroup.com) |
mobile: 0406770664 |
[CV/Resume](http://www.visualcv.com/philipsenger) |
[blog](http://www.apachecommonstipsandtricks.blogspot.com/) |
[LinkedIn](http://au.linkedin.com/in/philipsenger) |
[twitter](http://twitter.com/PSengerDownUndr)


### About

This Vagrant box contains vagrant and puppet recipes for creating a CentOS 6 system with RabbitMQ and RabbitMQ Web Management. In addition, there are two Node JS apps one called ```sub.js``` and the other ```pub.js```.

pub and sub put messages in a queue and respond, in an infinite loop. I created this project so I could easily build a Service Orchestration example in NodeJS and run it locally. 

### Install

* Download and install [Vagrant](https://www.vagrantup.com/downloads.html)
* Download and install  [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
* Clone the project ```git clone git@github.com:mheiges/vagrant-rabbitmq.git```
* In the project dir run ```vagrant up```

Optionally, the VM will use the `vagrant-hostmanager` plugin if it is installed.

    vagrant plugin install vagrant-hostmanager

### Installed Services

#### RabbitMQ

host: localhost  
port: 5672  

#### RabbitMQ Web client

url: http://localhost:15672/  
username: guest  
password: guest  


#### Puppet

Puppet manifests are applied during `vagrant provision`. To manually apply manifests on the VM, run:

    sudo puppet apply --modulepath=/vagrant/puppet/modules/forge:/vagrant/puppet/modules/custom  /vagrant/puppet/manifests

To view currently enabled RabbitMQ plugins, run on the VM:

    sudo puppet resource rabbitmq_plugin --modulepath=/vagrant/puppet/modules/forge:/vagrant/puppet/modules/custom


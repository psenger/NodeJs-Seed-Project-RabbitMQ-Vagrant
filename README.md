# NodeJS Seed Project for RabbitMQ ( Vagrant )

Written by Philip A Senger

[philip.a.senger@cngrgroup.com](mailto:philip.a.senger@cngrgroup.com) |
mobile: 0406770664 |
[CV/Resume](http://www.visualcv.com/philipsenger) |
[blog](http://www.apachecommonstipsandtricks.blogspot.com/) |
[LinkedIn](http://au.linkedin.com/in/philipsenger) |
[twitter](http://twitter.com/PSengerDownUndr)

### About

This project contains a Vagrant controlled Sun Virtual Machine with a Puppet recipe to build a server based on CentOS 6 with RabbitMQ and RabbitMQ Web Management. 

### Why

If you are reading this, you may wonder why I built this project. Using a Message Queue is vital to creating an elastic service. It allows the decoupling of components in a n-tier fashion and allows the cpu intensive component to be decoupled from the web-tier component. 

There are only two design patterns in this project a simple Worker Queue and a Remote Procedure Call. I wrote this in Node JS because I already know how to do this with Java and I wanted to see what it would look like with NodeJS. 
### What is next

What I would like to do next is build a Socket IO service that pushes rest requests via a RPC Message Queues. 

### How

In addition it contains a simple consumer and publisher example written in Node JS, see ```worker_queue/consumer.js```  and ```worker_queue/publisher.js``` and a RPC example in the directory ```rpc```. Im still refining the RPC example, but uses Bluebird promises. I would like to use Time Out and build something in that will throttle the clients. 

Running publisher puts the process in a infinite loop with random words in a JSON payload, while the consumer ( an infinite loop too ) simply counts the words and sends it to the console.

The exchange and queue are durable, but the ack is set when the message is pulled form the queue and not from the process. Something I would like to work on later.

I want to also add a reply to queue, but will have to do that later. I intend on adding more types of patterns to this project as time goes on.

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


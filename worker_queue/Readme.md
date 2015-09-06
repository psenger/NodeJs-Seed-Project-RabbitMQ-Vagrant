Worker Queue or Task Queue 
---

The purpose of this design pattern is to avoid doing resource-intensive tasks immediately. In practice, a piece of work is encapsulated as a message and sent to an exchange, which in turn n consumers can pull the work request. 

[ Producer 1 ] -> [ Exchange ] -> [ Queue:[][][][] ] <- [ Consumer(s) ]
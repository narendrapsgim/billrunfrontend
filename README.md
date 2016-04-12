BillRun As A Service - Next-Gen Billing On The Cloud

# BRaaS
* Install node and npm (if you are running on a Debian-based distro, you will need to create a symbolic link to node - `ln -s /usr/bin/nodejs /usr/bin/node`)
* Install NPM dependencies with `npm install`
* From the root of the project folder, start service with `npm start`. This will compile the code every time a .js file is saved.
* ???
* Profit!

Also - don't forget to create a virtual site with Nginx/Apache/YAWS/Whatever to point to the /public folder.

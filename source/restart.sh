unset http_proxy
unset https_proxy
rm plasma/plasma/plasma-api.log
rm plasma/plasma/plasma-conductor.log

sudo service plasma-api restart
sudo service plasma-conductor restart

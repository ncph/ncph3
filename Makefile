NCPHDIR = /usr/local/share/ncph
EODIR = /usr/local/share/eo

install:
	install -m 0644 -D ncph.html $(NCPHDIR)/play
	install -m 0644 {COPYING,favicon.ico,ncph.css,ncph.js,README.md,robots.txt} $(NCPHDIR)
	install -m 0644 -D eo.html $(EODIR)/play
	install -m 0644 {COPYING,favicon.ico,ncph.css,README.md,robots.txt} $(EODIR)

publish:
	scp ncph.html $(SRVNAME):$(NCPHDIR)/play
	scp {COPYING,favicon.ico,ncph.css,ncph.js,README.md,robots.txt} $(SRVNAME):$(NCPHDIR)
	scp eo.html $(SRVNAME):$(EODIR)/play
	scp {COPYING,favicon.ico,ncph.css,README.md,robots.txt} $(SRVNAME):$(EODIR)

uninstall:
	rm -rf $(NCPHDIR) $(EODIR)

ncph-server: server.go
	go build -o $@ server.go

root-install: ncph-server
	install -m 0644 --backup nginx.conf /etc/nginx/nginx.conf
	sed -i "s#NCPHHOSTNAME#$(NCPHHOSTNAME)#g" /etc/nginx/nginx.conf
	sed -i "s#EOHOSTNAME#$(EOHOSTNAME)#g" /etc/nginx/nginx.conf
	sed -i "s#NCPHCGIPORT#$(NCPHCGIPORT)#g" /etc/nginx/nginx.conf
	sed -i "s#EOCGIPORT#$(EOCGIPORT)#g" /etc/nginx/nginx.conf
	install -m 0755 ncph-server /usr/local/bin/ncph-server
	install -m 0644 ncph.service /lib/systemd/system/ncph.service
	sed -i "s#PORT#$(NCPHCGIPORT)#g" /lib/systemd/system/ncph.service
	systemctl enable ncph

NCPHDIR = /usr/local/share/ncph

install:
	install -m 0644 -D index.html $(NCPHDIR)/shhhhh
	install -m 0644 {COPYING,favicon.ico,ncph.css,ncph.js,README.md,robots.txt} $(NCPHDIR)

publish:
	scp index.html $(SRVNAME):$(NCPHDIR)/shhhhh
	scp {COPYING,favicon.ico,ncph.css,ncph.js,README.md,robots.txt} $(SRVNAME):$(NCPHDIR)

uninstall:
	rm -rf $(NCPHDIR)

nginx:
	install -m 0644 --backup nginx.conf /etc/nginx/nginx.conf
	sed -i "s#SRVNAME#$(SRVNAME)#g" /etc/nginx/nginx.conf

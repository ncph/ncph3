NCPHDIR = /usr/local/share/ncph
EODIR = /usr/local/share/eo

install:
	install -m 0644 -D ncph.html $(NCPHDIR)/play
	install -m 0644 {COPYING,favicon.ico,ncph.css,ncph.js,README.md,robots.txt} $(NCPHDIR)
	install -m 0644 -D eo.html $(EODIR)/play
	install -m 0644 {COPYING,ncph.css,README.md,robots.txt} $(EODIR)

publish:
	scp ncph.html $(SRVNAME):$(NCPHDIR)/play
	scp {COPYING,favicon.ico,ncph.css,ncph.js,README.md,robots.txt} $(SRVNAME):$(NCPHDIR)
	scp eo.html $(SRVNAME):$(EODIR)/play
	scp {COPYING,ncph.css,README.md,robots.txt} $(SRVNAME):$(EODIR)

uninstall:
	rm -rf $(NCPHDIR) $(EODIR)

nginx:
	install -m 0644 --backup nginx.conf /etc/nginx/nginx.conf
	sed -i "s#EOHOSTNAME#$(EOHOSTNAME)#g" /etc/nginx/nginx.conf
	sed -i "s#NCPHHOSTNAME#$(NCPHHOSTNAME)#g" /etc/nginx/nginx.conf

NCPHDIR = /usr/local/share/ncph

install:
	install -m 0644 -D index.html $(NCPHDIR)/index.html
	install -m 0644 -D favicon.ico $(NCPHDIR)/favicon.ico
	install -m 0644 -D ncph.css $(NCPHDIR)/ncph.css
	install -m 0644 -D ncph.js $(NCPHDIR)/ncph.js

uninstall:
	rm -rf $(NCPHDIR)

nginx:
	install -m 0644 --backup nginx.conf /etc/nginx/nginx.conf
	sed -i "s#SRVNAME#$(SRVNAME)#g" /etc/nginx/nginx.conf

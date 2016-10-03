// Copyright (C) 2016 ncph Authors
// This file is free software: You can redistribute it and/or modify it
// under the terms of the GNU AGPLv3 or later. See COPYING for details.
package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"
)

var bindaddr = flag.String("bindaddr", ":8080",
	"Port and optional address on which to bind")

var responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <timestamp>%d</timestamp>
  <viewers>%d</viewers>
</response>
`

var lastVisit = make(map[string]time.Time)

func cgi(w http.ResponseWriter, r *http.Request) {
	// TODO: Use sorted list instead, to prevent O(n) check.
	for visitor, visit := range lastVisit {
		if time.Since(visit) > 30*time.Second {
			delete(lastVisit, visitor)
		}
	}

	address := r.Header.Get("X-Forwarded-For")
	if address == "" {
		http.Error(w, "Required header X-Forwarded-For missing", 500)
		return
	}

	port := r.Header.Get("X-Forwarded-Port")
	if port == "" {
		http.Error(w, "Required header X-Forwarded-Port missing", 500)
		return
	}

	requester := address + ":" + port
	lastVisit[requester] = time.Now()
	timestamp := time.Now().UnixNano() / 1000000

	w.Header().Set("Content-Type", "text/xml")
	fmt.Fprintf(w, responseXml, timestamp, len(lastVisit))
}

func main() {
	flag.Parse()
	http.HandleFunc("/cgi", cgi)
	log.Fatal(http.ListenAndServe(*bindaddr, nil))
}

#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import jinja2
import os
import logging as log
import time
import json

jinja_environment = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.dirname(__file__) + "/templates/"))

def format_date(datetime):
	return datetime.strftime('%d/%m/%Y')

def format_time(datetime):
	return datetime.strftime('%H:%M')

def format_date_iso(datetime):
	return datetime.isoformat()

jinja_environment.filters['date'] = format_date
jinja_environment.filters['time'] = format_time
jinja_environment.filters['iso'] = format_date_iso
jinja_environment.globals.update(zip=zip)

class MainHandler(webapp2.RequestHandler):
	def get(self):
		template = jinja_environment.get_template("index.html")
		self.response.out.write(template.render())

def handle_404(request, response, exception):
	response.set_status(404)
	response.out.write('404 - Not found')

app = webapp2.WSGIApplication([
	('/', MainHandler)
	], debug=True)

app.error_handlers[404] = handle_404

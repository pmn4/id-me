require 'rubygems'

require File.dirname(__FILE__) + '/boot.rb'
config_dir = File.dirname(__FILE__) + '/config'

Bundler.require(:default)
# require 'sass/plugin/rack'
require './lib/id_me/home_app'

# app map
run Rack::URLMap.new({
	"/"        => Sprtid::HomeApp
})

# use SCSS for styling
# Sass::Plugin.options[:style] = :compressed
# use Sass::Plugin::Rack

require 'rack/rewrite'
use Rack::Rewrite do
  r301      %r{^api(?:[/\?](.*))?$},       'http://sprtid-api.herokuapp.com/$1'
  r301      %r{^app(?:[/\?](.*))?$},       'http://sprtid-app.divshot.io/#/$1'
end

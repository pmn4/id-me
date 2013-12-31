require 'rubygems'

require File.dirname(__FILE__) + '/boot.rb'
config_dir = File.dirname(__FILE__) + '/config'

Bundler.require(:default)
# require 'sass/plugin/rack'
require './lib/id_me/home_app'

# app map
run Rack::URLMap.new({
  "/"        => SprtId::HomeApp,
  "/app"     => SprtId::SprtIdApp,
})

# use SCSS for styling
# Sass::Plugin.options[:style] = :compressed
# use Sass::Plugin::Rack

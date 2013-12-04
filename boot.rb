# Set the environment to production if we detect the MongoHQ instance
ENV['RACK_ENV'] = 'production' if ENV['MONGOHQ_URL']

# Otherwise, we're in development
ENV['RACK_ENV'] ||= 'development'

require 'bundler'
require 'mongoid'

Bundler.setup
Bundler.require(:default, ENV["RACK_ENV"].to_sym)

Dir["./lib/**/*.rb"].each { |f| require f }

# Mongoid config
Mongoid.load!('config/mongoid.yml')


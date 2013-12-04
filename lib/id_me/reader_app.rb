require 'sinatra'
require 'sinatra/base'
require 'sinatra/reloader' if development?  # in dev, reload your app every time you make a change.  no more restarting!
require 'json'

require_relative 'helpers/view_helpers'

module IdMe
	class ReaderApp < Sinatra::Base
		set :root, File.expand_path("../..", File.dirname(__FILE__))
		set :views, File.dirname(__FILE__) + '/views'

		# configure do
		# 	Compass.add_project_configuration(File.join(Sinatra::Application.root, 'config', 'compass.config'))
		# end

		configure :development do
			register Sinatra::Reloader
		end

		helpers Helpers::ViewHelpers

		# get '/styles/:name.css' do
		# 	content_type 'text/css', :charset => 'utf-8'
		# 	scss(:"stylesheets/#{params[:name]}", Compass.sass_engine_options)
		# end

		before do
			content_type :json
		end

		get '/' do
			content_type :'text/html'
			erb :card
		end
	end
end


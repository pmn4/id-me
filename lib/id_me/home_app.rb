# require 'sinatra'
require 'sinatra/base'
require 'compass'
require 'rack/mobile-detect'

require_relative 'helpers/view_helpers'

module SprtId
	class HomeApp < Sinatra::Base
		set :root, File.expand_path("../..", File.dirname(__FILE__))
		set :views, File.dirname(__FILE__) + '/views'
		set :public_folder, 'public'

		helpers Helpers::ViewHelpers

		configure :development do
			register Sinatra::Reloader
		end

		configure do
			Compass.add_project_configuration(File.join(Sinatra::Application.root, 'config', 'compass.config'))
		end

		get '/styles/:name.css' do
			content_type 'text/css', :charset => 'utf-8'
			scss(:"stylesheets/#{params[:name]}", Compass.sass_engine_options)
		end

		get '/' do
			content_type :'text/html'

			@identities = []
			Models::FullIdentity.all.each do |identity|
				@identities << identity
			end

			erb :index
		end

		get '/create' do
			content_type :'text/html'
			@create_only = true
			erb :index
		end

		post '/create' do
			begin
				p params
				identity_document = Models::FullIdentity.new()
				identity_document.attributes = params[:identity]
				p 'save', identity_document.save
			rescue Exception => e
				@errors = ['Failed to save Identity']
				puts "An error occurred saving identity: #{e}"
			end

			if @errors && @errors.length
				content_type :'text/html'
				erb :create
			else
				redirect "/doc/#{identity_document['_id']}"
			end
		end

		get '/id' do
			content_type :'text/html'
			@display_only = true
			erb :create
		end

		get '/doc/:document_id' do
			content_type :'text/html'
			@identity = Models::FullIdentity.find(params[:document_id])
			erb :identity
		end

		get '/list' do
			@identities = []
			Models::FullIdentity.all.each do |identity|
				@identities << identity
			end
			erb :list
		end

		error 400..510 do
			puts inspect
			request.env['sinatra_error']
		end
	end
end

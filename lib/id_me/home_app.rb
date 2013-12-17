# require 'sinatra'
require 'sinatra/base'
require 'compass'
require 'rack/mobile-detect'
# require 'aws/s3'
require 'cloudinary'

set :bucket, 'mybucket'
set :s3_key, 'THISISANEXAMPLEKEYID'
set :s3_secret, 'Thi$isJu5taNExamp/etO0itSh0u1dBel0NgeR'

require_relative 'helpers/view_helpers'

module SprtId
	class HomeApp < Sinatra::Base
		LOGGER = Logger.new(STDOUT) unless defined?(LOGGER)

		set :root, File.expand_path("../..", File.dirname(__FILE__))
		set :views, File.dirname(__FILE__) + '/views'
		set :public_folder, 'public'

		helpers Helpers::ViewHelpers

		configure :development do
			register Sinatra::Reloader
		end

		configure do
			Compass.add_project_configuration(File.join(Sinatra::Application.root, 'config', 'compass.config'))
			enable :logging
			LOGGER.level = Logger::DEBUG
		end

		Cloudinary.config do |config|
			config.cloud_name = 'sprtid'
			config.api_key = '738889633191996'
			config.api_secret = 'He1EmU42y2Plv0FjaCU5SDpMLGQ'
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

# Environment variable: CLOUDINARY_URL=cloudinary://738889633191996:He1EmU42y2Plv0FjaCU5SDpMLGQ@sprtid
# Base delivery URL: http://res.cloudinary.com/sprtid
# Secure delivery URL: https://res.cloudinary.com/sprtid
# API Base URL: https://api.cloudinary.com/v1_1/sprtid

		post '/create' do
			p params
			identity_document = Models::FullIdentity.new()
			identity_document.attributes = params[:identity]

			filename = params[:profile_image][:filename] rescue nil
			tmpfile = params[:profile_image][:tempfile] rescue nil

			if identity_document.invalid? || tmpfile.nil? || filename.nil?
				@errors = ['Please complete all required fields']
				# content_type :'text/html'
				LOGGER.info("Form Validation Error /create")
				return erb :create
			end

			begin
				# image = Models::CloudinaryImage.new()
				# image.attributes = Cloudinary::Uploader.upload(tmpfile)
				image = Cloudinary::Uploader.upload(tmpfile)
				p 'before', identity_document
				identity_document.attributes = {:images => {:original => image}}
				p 'after', identity_document
			rescue Exception => e
				@errors = ['Failed to save Identity Image']
				puts "An error occurred saving identity: #{e.to_s}"
			end

			begin
				save_response = identity_document.save
				p 'save', save_response
			rescue Exception => e
				@errors = ['Failed to save Identity']
				LOGGER.error("An error occurred saving identity: #{e.to_s}")
			end

			if @errors && @errors.length
				# content_type :'text/html'
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

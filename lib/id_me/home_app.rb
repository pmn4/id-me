# require 'aws/s3'
require 'cloudinary'

set :bucket, 'mybucket'
set :s3_key, 'THISISANEXAMPLEKEYID'
set :s3_secret, 'Thi$isJu5taNExamp/etO0itSh0u1dBel0NgeR'

require_relative 'base_app'
require_relative 'helpers/view_helpers'

module Sprtid
	class HomeApp < BaseApp
		Cloudinary.config do |config|
			config.cloud_name = 'sprtid'
			config.api_key = '738889633191996'
			config.api_secret = 'He1EmU42y2Plv0FjaCU5SDpMLGQ'
		end

		get '/' do
			content_type :'text/html'

			@identities = []
			Models::FullIdentity.all.each do |identity|
				@identities << identity
			end

			erb :index
		end

		helpers do
			def initialized_id(key)
				id = nil
				# let's get hack tastic!
				case params[:init]
				when 'eb529743-2e63-4be7-8c43-f498c774708c'
					id = Models::FullIdentity.new({
						:name => 'Tony Lowe',
						:event => 'AAU Spring Baseball Classic',
						:organization => 'aau',
						:external_id => 'AAU a1b3c3',
						:team => 'Tigers',
						:sport => 'Baseball'
					})
				when 'e29ec939-0ad6-4b82-9964-00ee03f135d2'
					id = Models::FullIdentity.new({
						:name => 'Henry Forrest',
						:event => 'AAU Spring Baseball Classic',
						:organization => 'aau',
						:external_id => 'AAU #1',
						:team => 'Marlins',
						:sport => 'Baseball'
					})
				when 'eb81eb7e-09c4-4beb-b48b-a642b474e8e1'
					id = Models::FullIdentity.new({
						:name => 'Rusty Buchanan',
						:event => 'AAU Spring Baseball Classic',
						:organization => 'aau',
						:external_id => 'AAU aa11bb22',
						:team => 'Marlins',
						:sport => 'Baseball'
					})
				else
					id = nil
				end

				id
			end
		end

		get '/create' do
			content_type :'text/html'
			@create_only = true

			id = initialized_id(params[:init])

			WhiteLabel.organization = id.organization if id.respond_to?(:organization)
			params[:identity] = id || Models::FullIdentity.new()
			erb :create
		end

		get '/email/:init' do
			content_type :'text/html'
			@create_only = true

			@id = initialized_id(params[:init])

			WhiteLabel.organization = @id.organization if @id.respond_to?(:organization)
			@url = "http://www.sprtid.com/create?init=#{params[:init]}"
			erb :'email/pre_register', :layout => false
		end

# Environment variable: CLOUDINARY_URL=cloudinary://738889633191996:He1EmU42y2Plv0FjaCU5SDpMLGQ@sprtid
# Base delivery URL: http://res.cloudinary.com/sprtid
# Secure delivery URL: https://res.cloudinary.com/sprtid
# API Base URL: https://api.cloudinary.com/v1_1/sprtid

		post '/create' do
			identity_document = Models::FullIdentity.new()
			identity_document.attributes = params[:identity]

			filename = params[:profile_image][:filename] rescue nil
			tmpfile = params[:profile_image][:tempfile] rescue nil

			if identity_document.invalid? || tmpfile.nil? || filename.nil?
				@errors = ['Please complete all required fields']
				LOGGER.info("Form Validation Error /create")
				return erb :create
			end

			begin
				image = Models::CloudinaryImage.new()
				image.attributes = Cloudinary::Uploader.upload(tmpfile)
				identity_document.image = image
			rescue Exception => e
				@errors = ['Failed to save Identity Image']
				puts "An error occurred saving identity: #{e.to_s}"
			end

			begin
				save_response = identity_document.save
			rescue Exception => e
				@errors = ['Failed to save Identity']
				LOGGER.error("An error occurred saving identity: #{e.to_s}")
			end

			if @errors && @errors.length
				erb :create
			else
				redirect "/i/#{identity_document['_id']}"
			end
		end

		get '/i/:document_id' do # i => Identify #shorturls
			content_type :'text/html'
			@identity = Models::FullIdentity.find(params[:document_id])
			erb :identity
		end

		get '/ci/:document_id' do # ci => Check In #shorturls
			content_type :'text/html'
			@identity = Models::FullIdentity.find(params[:document_id])
			erb :check_in
		end

		get '/list' do
			@identities = []
			Models::FullIdentity.all.each do |identity|
				@identities << identity
			end
			erb :list
		end
	end
end

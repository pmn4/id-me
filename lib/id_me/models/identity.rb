require 'active_model'

module SprtId
	module Models
		class Base # < ActiveRecord::Base
			include Mongoid::Document

			field :version, :type => String, :default => '1.0'
		end

		class IdentityImage < Base
			field :key, :type => String
			field :height, :type => Integer
			field :width, :type => Integer
			field :type, :type => String
			field :secure_url, :type => String
		end

		class CloudinaryImage < IdentityImage
			field :public_id, :type => String
			field :version, :type => Integer
			field :signature, :type => String
			field :format, :type => String
			field :resource_type, :type => String
			field :created_at, :type => Date
			field :bytes, :type => Integer
			field :etag, :type => String
			field :secure_url, :type => String
		end

		class Identity < Base
			field :external_id, :type => String
		end

		class SimpleIdentity < Identity
			field :images, :type => Hash
			field :name, :type => String
			field :birthdate, :type => Date
		end

		class FullIdentity < SimpleIdentity
			field :organization, :type => String
			field :team, :type => String
			field :graduation_year, :type => Integer
			field :sport, :type => String
		end
	end
end
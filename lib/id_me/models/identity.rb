require_relative 'base'
require_relative 'checkin'

module Sprtid
	module Models
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

			has_many :checkins, :class_name => 'Sprtid::Models::Checkin', :inverse_of => :identity
			belongs_to :team, :class_name => 'Sprtid::Models::Team', :inverse_of => :players
		end

		class SimpleIdentity < Identity
			field :name, :type => String
			field :birthdate, :type => Date
			field :image, :type => IdentityImage
		end

		class FullIdentity < SimpleIdentity
			field :organization, :type => String
			field :event, :type => String
			field :team, :type => String
			field :graduation_year, :type => Integer
			field :sport, :type => String
		end
	end
end

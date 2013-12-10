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
			field :href, :type => String
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
require 'active_model'

module IdMe
	module Models
		class Base # < ActiveRecord::Base
			include ActiveModel::Validations

			attr_accessor :version

			def initialize(attributes)
				@version = "0.1"
			end
		end

		class IdentityImage < Base
			attr_accessor :key
			attr_accessor :height
			attr_accessor :width
			attr_accessor :type # url, base64
			attr_accessor :data

			validates :type,    :presence => true
			validates :data,    :presence => true

			def url=(val)
				@data = val
				@type = :url
			end

			def base64=(val)
				@data = val
				@type = :base64
			end

			def url?
				@type.to_sym == :url
			end

			def base64?
				@type.to_sym == :base64
			end

			def src
				case :type
				when :url
					@url
				when :base64
					"data:image/jpeg;base64,#{@base64}"
				else
					nil
				end
			end
		end

		class Identity < Base
			attr_reader :id
		end

		class OfflineIdentity < Identity
			attr_accessor :image_collection
			attr_accessor :name
			attr_accessor :birthdate
		end
	end
end
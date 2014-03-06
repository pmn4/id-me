require_relative 'base'

module Sprtid
	module Models
		class Location < Base
			field :name, :type => String
		end

		class LatLonLocation < Location
			field :latitude, :type => Float
			field :longitude, :type => Float
		end

		class AddressLocation < Location
			field :street1, :type => String
			field :street2, :type => String
			field :city, :type => String
			field :state, :type => String
			field :postal_code, :type => String
		end
	end
end
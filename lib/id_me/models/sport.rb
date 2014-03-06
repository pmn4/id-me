require_relative 'base'
require_relative 'organization'

module Sprtid
	module Models
		class Sport < Base
			field :name, :type => String

			belongs_to :organization, :class_name => 'Sprtid::Models::Organization', :inverse_of => :sports
		end
	end
end
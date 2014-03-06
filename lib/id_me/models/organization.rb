require_relative 'base'
require_relative 'sport'

module Sprtid
	module Models
		class Sport < Base
			field :name, :type => String

			belongs_to :organization, :class_name => 'Sprtid::Models::Organization', :inverse_of => :sports
		end
		class Organization < Base
			field :name, :type => String

			embeds_many :sports, :class_name => 'Sprtid::Models::Sport', :inverse_of => :organization
			has_many :events, :class_name => 'Sprtid::Models::Event', :inverse_of => :organization
		end
	end
end
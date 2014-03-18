require_relative 'base'
require_relative 'sport'

module Sprtid
	module Models
		class Organization < Base
			field :name, :type => String

			embeds_many :sports, :class_name => 'Sprtid::Models::Sport', :inverse_of => :organization
			has_many :events, :class_name => 'Sprtid::Models::Event', :inverse_of => :organization
		end

		class Team < Base
			field :name, :type => String

			embeds_many :players, :class_name => 'Sprtid::Models::Identity', :inverse_of => :sport
			belongs_to :organization, :class_name => 'Sprtid::Models::Organization', :inverse_of => :teams

			# which is it?
			# has_one :sport, :class_name => 'Sprtid::Models::Sport', :inverse_of => :teams
			# belongs_to :sport, :class_name => 'Sprtid::Models::Sport', :inverse_of => :teams
			embeds_one :sport, :class_name => 'Sprtid::Models::Sport', :inverse_of => :teams
		end
	end
end
require 'securerandom'
require 'fileutils'

class HomeController < ApplicationController

	protect_from_forgery except: :recieve_pdf

  # GET /home
  def index
  	@error = "You didn't set up API_TOKEN environment variable. Please set up the variable and refresh the page." if ENV['API_TOKEN'].blank?
  end

  def about
    
  end

  def generate_pdf

		Hpa.api_token = ENV['API_TOKEN']
		
		id = SecureRandom.uuid
		callback_url = "#{request.base_url}/recieve_pdf/#{id}"
		response = Hpa::Pdf.create(
      :url => "#{request.base_url}/example.html",
			:callback => callback_url,
      :margin_top => 0,
      :margin_right => 0,
      :margin_bottom => 0,
      :margin_left => 0
    )

		cookies[:file_id] = id

		respond_to do |format|
			msg = { :status => response }
			format.json  { render :json => msg }
		end
  end

  def recieve_pdf

  	pdf_name = params[:id] + ".pdf"

		private_pdf_dir = 'public/uploads/pdf'
		pdf_file_path = [private_pdf_dir, pdf_name].join("/")
		FileUtils.mkdir_p private_pdf_dir


  	file = params[:file]
   	File.open(pdf_file_path, "wb") do |f|
   	  f.write file.read
   	end

   	render text: 'ok'

  end

  def check

		pdf_name = params[:id] + ".pdf"
		
		pdf_file_path = ['public/uploads/pdf', pdf_name].join("/")

		pdf_exists = File.exists? pdf_file_path

  	respond_to do |format|
	     msg = pdf_exists ? { status: 'Done', url: "#{request.base_url}/uploads/pdf/#{pdf_name}" } : { status: 'Processing' }

	    format.json  { render :json => msg }
	  end
  end

end

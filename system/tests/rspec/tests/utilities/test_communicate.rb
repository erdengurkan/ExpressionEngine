require './bootstrap.rb'

feature 'Communicate' do

	before(:all) do
		@test_subject = 'Rspec utilities/communicate test'
		@test_from = 'ellislab.developers@gmail.com'
		@test_recipient = 'seth.barber@ellislab.com'
	end

	before(:each) do
		cp_session
		@page = Communicate.new
		@page.load

		@page.should be_displayed
		@page.title.text.should eq 'Communicate ✱ Required Fields'
		@page.should have_subject
		@page.should have_body
		@page.should have_mailtype
		@page.should have_wordwrap
		@page.should have_from_email
		@page.should have_attachment
		@page.should have_recipient
		@page.should have_cc
		@page.should have_bcc
		@page.should have_member_groups
		@page.should have_submit_button
	end

	it "shows the Communicate page" do
		@page.mailtype.value.should eq 'text'
		@page.wordwrap.checked?.should eq true
	end

	it "shows errors when required fields are not populated" do
		@page.from_email.set ''
		@page.submit_button.click

		@page.should have_alert
		@page.should have_css 'div.alert.issue'
		@page.alert.should have_text "An error occurred"

		@page.subject.first(:xpath, ".//../..")[:class].should include 'invalid'
		@page.subject.first(:xpath, ".//..").should have_css 'em.ee-form-error-message'
		@page.subject.first(:xpath, ".//..").should have_text 'field is required.'

		@page.body.first(:xpath, ".//../..")[:class].should include 'invalid'
		@page.body.first(:xpath, ".//..").should have_css 'em.ee-form-error-message'
		@page.body.first(:xpath, ".//..").should have_text 'field is required.'

		@page.from_email.first(:xpath, ".//../..")[:class].should include 'invalid'
		@page.from_email.first(:xpath, ".//..").should have_css 'em.ee-form-error-message'
		@page.from_email.first(:xpath, ".//..").should have_text 'field is required.'

		@page.recipient.first(:xpath, ".//../..")[:class].should include 'invalid'
		@page.recipient.first(:xpath, ".//..").should have_css 'em.ee-form-error-message'
		@page.recipient.first(:xpath, ".//..").should have_text 'You left some fields empty.'

		@page.submit_button[:value].should eq 'Fix Errors, Please'
	end

	it "validates email fields" do
		my_email = 'not an email'

		@page.from_email.set my_email
		@page.recipient.set my_email
		@page.cc.set my_email
		@page.bcc.set my_email
		@page.submit_button.click

		@page.should have_alert
		@page.should have_css 'div.alert.issue'
		@page.alert.should have_text "An error occurred"

		@page.from_email.value.should eq my_email
		@page.from_email.first(:xpath, ".//../..")[:class].should include 'invalid'
		@page.from_email.first(:xpath, ".//..").should have_css 'em.ee-form-error-message'
		@page.from_email.first(:xpath, ".//..").should have_text 'field must contain a valid email address.'

		@page.recipient.value.should eq my_email
		@page.recipient.first(:xpath, ".//../..")[:class].should include 'invalid'
		@page.recipient.first(:xpath, ".//..").should have_css 'em.ee-form-error-message'
		@page.recipient.first(:xpath, ".//..").should have_text 'field must contain all valid email addresses.'

		@page.cc.value.should eq my_email
		@page.cc.first(:xpath, ".//../..")[:class].should include 'invalid'
		@page.cc.first(:xpath, ".//..").should have_css 'em.ee-form-error-message'
		@page.cc.first(:xpath, ".//..").should have_text 'field must contain all valid email addresses.'

		@page.bcc.value.should eq my_email
		@page.bcc.first(:xpath, ".//../..")[:class].should include 'invalid'
		@page.bcc.first(:xpath, ".//..").should have_css 'em.ee-form-error-message'
		@page.bcc.first(:xpath, ".//..").should have_text 'field must contain all valid email addresses.'
	end

	it "denies multiple email addresses in from field" do
		my_email = 'one@nomail.com,two@nomail.com'

		@page.from_email.set my_email
		@page.submit_button.click

		@page.should have_alert
		@page.should have_css 'div.alert.issue'
		@page.alert.should have_text 'An error occurred'

		@page.from_email.value.should eq my_email
		@page.from_email.first(:xpath, ".//../..")[:class].should include 'invalid'
		@page.from_email.first(:xpath, ".//..").should have_css 'em.ee-form-error-message'
		@page.from_email.first(:xpath, ".//..").should have_text 'field must contain a valid email address.'
	end

	it "accepts multiple email addresses" do
		my_email = 'one@nomail.com,two@nomail.com'
		@page.recipient.set my_email
		@page.cc.set my_email
		@page.bcc.set my_email
		@page.submit_button.click

		@page.recipient.value.should eq my_email
		@page.recipient.first(:xpath, ".//../..")[:class].should_not include 'invalid'
		@page.recipient.first(:xpath, ".//..").should_not have_css 'em.ee-form-error-message'
		@page.recipient.first(:xpath, ".//..").should_not have_text 'field must contain all valid email addresses.'

		@page.cc.value.should eq my_email
		@page.cc.first(:xpath, ".//../..")[:class].should_not include 'invalid'
		@page.cc.first(:xpath, ".//..").should_not have_css 'em.ee-form-error-message'
		@page.cc.first(:xpath, ".//..").should_not have_text 'field must contain all valid email addresses.'

		@page.bcc.value.should eq my_email
		@page.bcc.first(:xpath, ".//../..")[:class].should_not include 'invalid'
		@page.bcc.first(:xpath, ".//..").should_not have_css 'em.ee-form-error-message'
		@page.bcc.first(:xpath, ".//..").should_not have_text 'field must contain all valid email addresses.'
	end

	it "allows recipient to be empty if a group is selected" do
		@page.member_groups[0].set(true)
		@page.submit_button.click

		@page.recipient.first(:xpath, ".//../..")[:class].should_not include 'invalid'
		@page.recipient.first(:xpath, ".//..").should_not have_css 'em.ee-form-error-message'
		@page.recipient.first(:xpath, ".//..").should_not have_text 'You left some fields empty.'
	end

	# With the following tests it would be ideal to check the sent email
	# to confirm the various settings. Right now all we are confirming
	# is a lack of errors
	it "wraps words" do
		my_subject = @test_subject + ' word wrapping'
		my_body = "Facillimum id quidem est, inquam. Non est ista, inquam, Piso, magna dissensio. Non autem hoc: igitur ne illud quidem. Sed quid sentiat, non videtis."

		# body_wrapped = "Facillimum id quidem est, inquam. Non est ista, inquam, Piso, magna\ndissensio. Non autem hoc: igitur ne illud quidem. Sed quid sentiat, non\nvidetis."

		@page.subject.set my_subject
		@page.from_email.set @test_from
		@page.recipient.set @test_recipient
		@page.body.set my_body
		@page.submit_button.click

		@page.should have_alert
		@page.should have_css 'div.alert.success'
		@page.alert.should have_text 'Your email has been sent'
		@page.current_url.should include 'utilities/communicate/sent'
	end

	it "can send a plain text email" do
		my_subject = @test_subject + ' plain text email'
		my_body = "This a test email sent from the communicate tool."

		@page.subject.set my_subject
		@page.from_email.set @test_from
		@page.recipient.set @test_recipient
		@page.body.set my_body
		@page.submit_button.click

		@page.should have_alert
		@page.should have_css 'div.alert.success'
		@page.alert.should have_text 'Your email has been sent'
		@page.current_url.should include 'utilities/communicate/sent'
	end

	it "can send markdown email" do
		my_subject = @test_subject + ' markdown email'
		my_body = "#This is Markdown\n\n[This](http://ellislab.com) is a link.\n**Nice huh?**"

		@page.subject.set my_subject
		@page.from_email.set @test_from
		@page.recipient.set @test_recipient
		@page.body.set my_body
		@page.mailtype.set "markdown"
		@page.submit_button.click

		@page.should have_alert
		@page.should have_css 'div.alert.success'
		@page.alert.should have_text 'Your email has been sent'
		@page.current_url.should include 'utilities/communicate/sent'
	end

	it "can send html email" do
		my_subject = @test_subject + ' html email'
		my_body = "<h1>HTML Email</h1><p>A <strong>strong</strong><em>emphasis</em> on <a href='http://www.ellislab.com'>anchors</a></p>"

		@page.subject.set my_subject
		@page.from_email.set @test_from
		@page.recipient.set @test_recipient
		@page.body.set my_body
		@page.mailtype.set "html"
		@page.submit_button.click

		@page.should have_alert
		@page.should have_css 'div.alert.success'
		@page.alert.should have_text 'Your email has been sent'
		@page.current_url.should include 'utilities/communicate/sent'
	end

	it "can send an attachment" do
		my_subject = @test_subject + ' attachment email'
		my_body = "This a test email sent from the communicate tool."

		@page.subject.set my_subject
		@page.from_email.set @test_from
		@page.recipient.set @test_recipient
		@page.body.set my_body
		@page.attach_file('attachment', 'readme.md')
		@page.submit_button.click

		@page.should have_alert
		@page.should have_css 'div.alert.success'
		@page.alert.should have_text 'Your email has been sent'
		@page.current_url.should include 'utilities/communicate/sent'
	end
end
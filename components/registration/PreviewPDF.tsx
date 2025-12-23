import React from 'react';
import { Download, Printer, CheckCircle, Facebook, Instagram, Twitter, Linkedin, User, MapPin, GraduationCap, Briefcase, Users, MessageSquare } from 'lucide-react';

interface PreviewPDFProps {
  formData: any;
  imagePreview: string;
}

const PreviewPDF: React.FC<PreviewPDFProps> = ({ formData, imagePreview }) => {
  const generatePDF = () => {
    const pdfContent = document.getElementById('pdf-content');
    if (!pdfContent) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${formData.fullName || 'Alumni'} - Registration</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Times New Roman', serif; 
                line-height: 1.6;
                color: #000;
                background: #fff;
              }
              .pdf-document {
                max-width: 210mm;
                margin: 0 auto;
                padding: 20mm;
                background: white;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 3px double #000;
                padding-bottom: 20px;
              }
              .header h1 {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 8px;
                letter-spacing: 1px;
              }
              .header p {
                font-size: 16px;
                font-style: italic;
                color: #333;
              }
              .content-wrapper {
                display: flex;
                gap: 30px;
                margin-top: 30px;
              }
              .left-column {
                flex: 0 0 180px;
              }
              .right-column {
                flex: 1;
              }
              .photo-container {
                width: 180px;
                height: 220px;
                border: 2px solid #000;
                margin-bottom: 20px;
                overflow: hidden;
              }
              .photo-container img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              .section {
                margin-bottom: 25px;
              }
              .section-title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 12px;
                text-transform: uppercase;
                border-bottom: 2px solid #000;
                padding-bottom: 5px;
                letter-spacing: 0.5px;
              }
              .field {
                margin-bottom: 12px;
              }
              .field-label {
                font-weight: bold;
                font-size: 12px;
                color: #000;
                margin-bottom: 2px;
              }
              .field-value {
                font-size: 13px;
                color: #000;
                padding-left: 10px;
              }
              .grid-2 {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
              }
              .grid-3 {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 10px;
              }
              .message-box {
                border: 1px solid #000;
                padding: 15px;
                margin-top: 10px;
                font-style: italic;
                background: #f9f9f9;
              }
              .involvement-list {
                list-style: none;
                padding-left: 10px;
              }
              .involvement-list li {
                margin-bottom: 5px;
                padding-left: 15px;
                position: relative;
              }
              .involvement-list li:before {
                content: "•";
                position: absolute;
                left: 0;
                font-weight: bold;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #000;
                text-align: center;
                font-size: 12px;
              }
              .social-link {
                font-size: 11px;
                word-break: break-all;
              }
              @media print {
                body { margin: 0; }
                .pdf-document { margin: 0; padding: 15mm; }
              }
            </style>
          </head>
          <body>
            ${pdfContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const printPreview = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Review Your Registration</h2>
          <p className="text-gray-600">Please verify all information before submitting</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={generatePDF} 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2.5 font-semibold flex items-center justify-center shadow-lg transition-colors"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </button>
          <button 
            onClick={printPreview} 
            className="border-2 border-gray-300 rounded-lg px-6 py-2.5 font-semibold hover:bg-gray-50 flex items-center justify-center transition-colors"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      {/* Warning Alert */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-lg print:hidden">
        <p className="text-amber-800 font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          Important: Once submitted, you cannot edit your registration. Please review carefully.
        </p>
      </div>

      {/* Web Preview */}
      <div className="bg-white rounded-2xl shadow-xl p-8 print:hidden">
        <div className="text-center mb-8 pb-6 border-b-2">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">YES INDIA Foundation</h1>
          <p className="text-lg text-gray-600">Alumni Registration Record</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left - Photo */}
          <div className="lg:col-span-1">
            {imagePreview && (
              <div className="mb-6">
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full rounded-lg shadow-md border-2 border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Right - All Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Personal Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Full Name</p>
                  <p className="text-base text-gray-900">{formData.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Mobile Number</p>
                  <p className="text-base text-gray-900">{formData.mobileNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">WhatsApp Number</p>
                  <p className="text-base text-gray-900">{formData.whatsappNumber}</p>
                </div>
              </div>
              
              {/* Social Media */}
              {(formData.facebookLink || formData.instagramLink || formData.twitterLink || formData.linkedinLink) && (
                <div className="mt-4 pl-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                  {formData.facebookLink && (
                    <div className="flex items-center gap-1.5">
                      <Facebook className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{formData.facebookLink}</span>
                    </div>
                  )}
                  {formData.instagramLink && (
                    <div className="flex items-center gap-1.5">
                      <Instagram className="w-4 h-4 text-pink-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{formData.instagramLink}</span>
                    </div>
                  )}
                  {formData.twitterLink && (
                    <div className="flex items-center gap-1.5">
                      <Twitter className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{formData.twitterLink}</span>
                    </div>
                  )}
                  {formData.linkedinLink && (
                    <div className="flex items-center gap-1.5">
                      <Linkedin className="w-4 h-4 text-blue-700 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{formData.linkedinLink}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-bold text-gray-800">Address Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
                <div className="md:col-span-3">
                  <p className="text-sm font-semibold text-gray-600">Address</p>
                  <p className="text-base text-gray-900">{formData.address}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">City</p>
                  <p className="text-base text-gray-900">{formData.place}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">State</p>
                  <p className="text-base text-gray-900">{formData.state}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Pin Code</p>
                  <p className="text-base text-gray-900">{formData.pinCode}</p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-orange-600" />
                <h3 className="text-xl font-bold text-gray-800">Educational Background</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                <div>
                  <p className="text-sm font-semibold text-gray-600">School Attended</p>
                  <p className="text-base text-gray-900">{formData.schoolAttended}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Year of Graduation</p>
                  <p className="text-base text-gray-900">{formData.yearOfGraduation}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Last Class Attended</p>
                  <p className="text-base text-gray-900">
                    {formData.lastClassAttended === 'Other' ? formData.otherClass : formData.lastClassAttended}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Qualification</p>
                  <p className="text-base text-gray-900">{formData.qualification}</p>
                </div>
                {formData.additionalQualification && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-semibold text-gray-600">Additional Qualifications</p>
                    <p className="text-base text-gray-900">{formData.additionalQualification}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Professional */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-800">Professional Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Job Title</p>
                  <p className="text-base text-gray-900">{formData.currentJobTitle}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Company Name</p>
                  <p className="text-base text-gray-900">{formData.companyName}</p>
                </div>
              </div>
            </div>

            {/* Involvement */}
            {formData.stayInvolved && formData.stayInvolved.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-teal-600" />
                  <h3 className="text-xl font-bold text-gray-800">Ways to Stay Involved</h3>
                </div>
                <ul className="pl-7 space-y-1">
                  {formData.stayInvolved.map((option: string, index: number) => (
                    <li key={index} className="text-base text-gray-900 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full flex-shrink-0"></span>
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Message to Teacher */}
            {formData.messageToTeacher && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-800">Message to Teacher</h3>
                </div>
                <p className="text-gray-700 italic pl-7 border-l-4 border-purple-300 py-2">&quot;{formData.messageToTeacher}&quot;</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t-2 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Registration Date:</span> {new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Ready to Submit</span>
          </div>
        </div>
      </div>

      {/* PDF Content (Hidden) */}
      <div id="pdf-content" className="hidden">
        <div className="pdf-document">
          <div className="header">
            <h1>YES INDIA FOUNDATION</h1>
            <p>Alumni Registration Record</p>
          </div>

          <div className="content-wrapper">
            <div className="left-column">
              {imagePreview && (
                <div className="photo-container">
                  <img src={imagePreview} alt="Profile" />
                </div>
              )}
            </div>

            <div className="right-column">
              {/* Personal Information */}
              <div className="section">
                <div className="section-title">Personal Information</div>
                <div className="field">
                  <div className="field-label">Full Name:</div>
                  <div className="field-value">{formData.fullName}</div>
                </div>
                <div className="grid-2">
                  <div className="field">
                    <div className="field-label">Mobile Number:</div>
                    <div className="field-value">{formData.mobileNumber}</div>
                  </div>
                  <div className="field">
                    <div className="field-label">WhatsApp Number:</div>
                    <div className="field-value">{formData.whatsappNumber}</div>
                  </div>
                </div>
                
                {(formData.facebookLink || formData.instagramLink || formData.twitterLink || formData.linkedinLink) && (
                  <div style={{marginTop: '10px'}}>
                    <div className="field-label">Social Media:</div>
                    <div className="field-value" style={{display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '11px'}}>
                      {formData.facebookLink && (
                        <span><Facebook/>{formData.facebookLink}</span>
                      )}
                      {formData.instagramLink && (
                        <span> <Instagram/>{formData.instagramLink}</span>
                      )}
                      {formData.twitterLink && (
                        <span><Twitter/>{formData.twitterLink}</span>
                      )}
                      {formData.linkedinLink && (
                        <span><Linkedin/>{formData.linkedinLink}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Address Details */}
              <div className="section">
                <div className="section-title">Address Details</div>
                <div className="field">
                  <div className="field-label">Address:</div>
                  <div className="field-value">{formData.address}</div>
                </div>
                <div className="grid-3">
                  <div className="field">
                    <div className="field-label">City:</div>
                    <div className="field-value">{formData.place}</div>
                  </div>
                  <div className="field">
                    <div className="field-label">State:</div>
                    <div className="field-value">{formData.state}</div>
                  </div>
                  <div className="field">
                    <div className="field-label">Pin Code:</div>
                    <div className="field-value">{formData.pinCode}</div>
                  </div>
                </div>
              </div>

              {/* Educational Background */}
              <div className="section">
                <div className="section-title">Educational Background</div>
                <div className="grid-2">
                  <div className="field">
                    <div className="field-label">School Attended:</div>
                    <div className="field-value">{formData.schoolAttended}</div>
                  </div>
                  <div className="field">
                    <div className="field-label">Year of Graduation:</div>
                    <div className="field-value">{formData.yearOfGraduation}</div>
                  </div>
                  <div className="field">
                    <div className="field-label">Last Class Attended:</div>
                    <div className="field-value">
                      {formData.lastClassAttended === 'Other' ? formData.otherClass : formData.lastClassAttended}
                    </div>
                  </div>
                  <div className="field">
                    <div className="field-label">Qualification:</div>
                    <div className="field-value">{formData.qualification}</div>
                  </div>
                </div>
                {formData.additionalQualification && (
                  <div className="field">
                    <div className="field-label">Additional Qualifications:</div>
                    <div className="field-value">{formData.additionalQualification}</div>
                  </div>
                )}
              </div>

              {/* Professional Details */}
              <div className="section">
                <div className="section-title">Professional Details</div>
                <div className="grid-2">
                  <div className="field">
                    <div className="field-label">Job Title:</div>
                    <div className="field-value">{formData.currentJobTitle}</div>
                  </div>
                  <div className="field">
                    <div className="field-label">Company Name:</div>
                    <div className="field-value">{formData.companyName}</div>
                  </div>
                </div>
              </div>

              {/* Ways to Stay Involved */}
              {formData.stayInvolved && formData.stayInvolved.length > 0 && (
                <div className="section">
                  <div className="section-title">Ways to Stay Involved</div>
                  <ul className="involvement-list">
                    {formData.stayInvolved.map((option: string, index: number) => (
                      <li key={index}>{option}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Message to Teacher */}
              {formData.messageToTeacher && (
                <div className="section">
                  <div className="section-title">Message to Teacher</div>
                  <div className="message-box">
                    &quot{formData.messageToTeacher}&quot;
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="footer">
            <p><strong>Registration Date:</strong> {new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</p>
            <p style={{marginTop: '10px'}}>YES INDIA Foundation - Alumni Network</p>
          </div>
        </div>
      </div>

      {/* Final Confirmation */}
      <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-lg print:hidden">
        <p className="text-green-800 text-sm leading-relaxed">
          <span className="font-bold">✓ All information verified:</span> Your registration form is complete and ready to be submitted. 
          Click the &quot;Submit Registration&quot; button below to finalize your registration with YES INDIA Foundation.
        </p>
      </div>
    </div>
  );
};

export default PreviewPDF;
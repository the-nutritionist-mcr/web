import { isSelectedMeal } from '@tnmw/meal-planning';
import { SelectedItem } from '@tnmw/types';

export const makeEmail = (name: string, deliveries: SelectedItem[][]) => `
<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <!-- NAME: 1 COLUMN - FULL WIDTH -->
  <!--[if gte mso 15]>
        <xml>
            <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>*|MC:SUBJECT|*</title>

  <style type="text/css">
    p {
      margin: 10px 0;
      padding: 0;
    }

    table {
      border-collapse: collapse;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      display: block;
      margin: 0;
      padding: 0;
    }

    img,
    a img {
      border: 0;
      height: auto;
      outline: none;
      text-decoration: none;
    }

    body,
    #bodyTable,
    #bodyCell {
      height: 100%;
      margin: 0;
      padding: 0;
      width: 100%;
    }

    .mcnPreviewText {
      display: none !important;
    }

    #outlook a {
      padding: 0;
    }

    img {
      -ms-interpolation-mode: bicubic;
    }

    table {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    .ReadMsgBody {
      width: 100%;
    }

    .ExternalClass {
      width: 100%;
    }

    p,
    a,
    li,
    td,
    blockquote {
      mso-line-height-rule: exactly;
    }

    a[href^=tel],
    a[href^=sms] {
      color: inherit;
      cursor: default;
      text-decoration: none;
    }

    p,
    a,
    li,
    td,
    body,
    table,
    blockquote {
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    .ExternalClass,
    .ExternalClass p,
    .ExternalClass td,
    .ExternalClass div,
    .ExternalClass span,
    .ExternalClass font {
      line-height: 100%;
    }

    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    .templateContainer {
      max-width: 600px !important;
    }

    a.mcnButton {
      display: block;
    }

    .mcnImage,
    .mcnRetinaImage {
      vertical-align: bottom;
    }

    .mcnTextContent {
      word-break: break-word;
    }

    .mcnTextContent img {
      height: auto !important;
    }

    .mcnDividerBlock {
      table-layout: fixed !important;
    }

    /*
	@tab Page
	@section Background Style
	@tip Set the background color and top border for your email. You may want to choose colors that match your company's branding.
	*/
    body,
    #bodyTable {
      /*@editable*/
      background-color: #FAFAFA;
    }

    /*
	@tab Page
	@section Background Style
	@tip Set the background color and top border for your email. You may want to choose colors that match your company's branding.
	*/
    #bodyCell {
      /*@editable*/
      border-top: 0;
    }

    /*
	@tab Page
	@section Heading 1
	@tip Set the styling for all first-level headings in your emails. These should be the largest of your headings.
	@style heading 1
	*/
    h1 {
      /*@editable*/
      color: #202020;
      /*@editable*/
      font-family: Helvetica;
      /*@editable*/
      font-size: 26px;
      /*@editable*/
      font-style: normal;
      /*@editable*/
      font-weight: bold;
      /*@editable*/
      line-height: 125%;
      /*@editable*/
      letter-spacing: normal;
      /*@editable*/
      text-align: left;
    }

    /*
	@tab Page
	@section Heading 2
	@tip Set the styling for all second-level headings in your emails.
	@style heading 2
	*/
    h2 {
      /*@editable*/
      color: #202020;
      /*@editable*/
      font-family: Helvetica;
      /*@editable*/
      font-size: 22px;
      /*@editable*/
      font-style: normal;
      /*@editable*/
      font-weight: bold;
      /*@editable*/
      line-height: 125%;
      /*@editable*/
      letter-spacing: normal;
      /*@editable*/
      text-align: left;
    }

    /*
	@tab Page
	@section Heading 3
	@tip Set the styling for all third-level headings in your emails.
	@style heading 3
	*/
    h3 {
      /*@editable*/
      color: #202020;
      /*@editable*/
      font-family: Helvetica;
      /*@editable*/
      font-size: 20px;
      /*@editable*/
      font-style: normal;
      /*@editable*/
      font-weight: bold;
      /*@editable*/
      line-height: 125%;
      /*@editable*/
      letter-spacing: normal;
      /*@editable*/
      text-align: left;
    }

    /*
	@tab Page
	@section Heading 4
	@tip Set the styling for all fourth-level headings in your emails. These should be the smallest of your headings.
	@style heading 4
	*/
    h4 {
      /*@editable*/
      color: #202020;
      /*@editable*/
      font-family: Helvetica;
      /*@editable*/
      font-size: 18px;
      /*@editable*/
      font-style: normal;
      /*@editable*/
      font-weight: bold;
      /*@editable*/
      line-height: 125%;
      /*@editable*/
      letter-spacing: normal;
      /*@editable*/
      text-align: left;
    }

    /*
	@tab Preheader
	@section Preheader Style
	@tip Set the background color and borders for your email's preheader area.
	*/
    #templatePreheader {
      /*@editable*/
      background-color: #FAFAFA;
      /*@editable*/
      background-image: none;
      /*@editable*/
      background-repeat: no-repeat;
      /*@editable*/
      background-position: center;
      /*@editable*/
      background-size: cover;
      /*@editable*/
      border-top: 0;
      /*@editable*/
      border-bottom: 0;
      /*@editable*/
      padding-top: 9px;
      /*@editable*/
      padding-bottom: 9px;
    }

    /*
	@tab Preheader
	@section Preheader Text
	@tip Set the styling for your email's preheader text. Choose a size and color that is easy to read.
	*/
    #templatePreheader .mcnTextContent,
    #templatePreheader .mcnTextContent p {
      /*@editable*/
      color: #656565;
      /*@editable*/
      font-family: Helvetica;
      /*@editable*/
      font-size: 12px;
      /*@editable*/
      line-height: 150%;
      /*@editable*/
      text-align: left;
    }

    /*
	@tab Preheader
	@section Preheader Link
	@tip Set the styling for your email's preheader links. Choose a color that helps them stand out from your text.
	*/
    #templatePreheader .mcnTextContent a,
    #templatePreheader .mcnTextContent p a {
      /*@editable*/
      color: #656565;
      /*@editable*/
      font-weight: normal;
      /*@editable*/
      text-decoration: underline;
    }

    /*
	@tab Header
	@section Header Style
	@tip Set the background color and borders for your email's header area.
	*/
    #templateHeader {
      /*@editable*/
      background-color: #FFFFFF;
      /*@editable*/
      background-image: none;
      /*@editable*/
      background-repeat: no-repeat;
      /*@editable*/
      background-position: center;
      /*@editable*/
      background-size: cover;
      /*@editable*/
      border-top: 0;
      /*@editable*/
      border-bottom: 0;
      /*@editable*/
      padding-top: 9px;
      /*@editable*/
      padding-bottom: 0;
    }

    /*
	@tab Header
	@section Header Text
	@tip Set the styling for your email's header text. Choose a size and color that is easy to read.
	*/
    #templateHeader .mcnTextContent,
    #templateHeader .mcnTextContent p {
      /*@editable*/
      color: #202020;
      /*@editable*/
      font-family: Helvetica;
      /*@editable*/
      font-size: 16px;
      /*@editable*/
      line-height: 150%;
      /*@editable*/
      text-align: left;
    }

    /*
	@tab Header
	@section Header Link
	@tip Set the styling for your email's header links. Choose a color that helps them stand out from your text.
	*/
    #templateHeader .mcnTextContent a,
    #templateHeader .mcnTextContent p a {
      /*@editable*/
      color: #007C89;
      /*@editable*/
      font-weight: normal;
      /*@editable*/
      text-decoration: underline;
    }

    /*
	@tab Body
	@section Body Style
	@tip Set the background color and borders for your email's body area.
	*/
    #templateBody {
      /*@editable*/
      background-color: #FFFFFF;
      /*@editable*/
      background-image: none;
      /*@editable*/
      background-repeat: no-repeat;
      /*@editable*/
      background-position: center;
      /*@editable*/
      background-size: cover;
      /*@editable*/
      border-top: 0;
      /*@editable*/
      border-bottom: 0;
      /*@editable*/
      padding-top: 9px;
      /*@editable*/
      padding-bottom: 9px;
    }

    /*
	@tab Body
	@section Body Text
	@tip Set the styling for your email's body text. Choose a size and color that is easy to read.
	*/
    #templateBody .mcnTextContent,
    #templateBody .mcnTextContent p {
      /*@editable*/
      color: #202020;
      /*@editable*/
      font-family: Helvetica;
      /*@editable*/
      font-size: 16px;
      /*@editable*/
      line-height: 150%;
      /*@editable*/
      text-align: left;
    }

    /*
	@tab Body
	@section Body Link
	@tip Set the styling for your email's body links. Choose a color that helps them stand out from your text.
	*/
    #templateBody .mcnTextContent a,
    #templateBody .mcnTextContent p a {
      /*@editable*/
      color: #007C89;
      /*@editable*/
      font-weight: normal;
      /*@editable*/
      text-decoration: underline;
    }

    /*
	@tab Footer
	@section Footer Style
	@tip Set the background color and borders for your email's footer area.
	*/
    #templateFooter {
      /*@editable*/
      background-color: #ffa397;
      /*@editable*/
      background-image: none;
      /*@editable*/
      background-repeat: no-repeat;
      /*@editable*/
      background-position: center;
      /*@editable*/
      background-size: cover;
      /*@editable*/
      border-top: 0;
      /*@editable*/
      border-bottom: 0;
      /*@editable*/
      padding-top: 20px;
      /*@editable*/
      padding-bottom: 30px;
    }

    /*
	@tab Footer
	@section Footer Text
	@tip Set the styling for your email's footer text. Choose a size and color that is easy to read.
	*/
    #templateFooter .mcnTextContent,
    #templateFooter .mcnTextContent p {
      /*@editable*/
      color: #ffffff;
      /*@editable*/
      font-family: 'Helvetica Neue', Helvetica, Arial, Verdana, sans-serif;
      /*@editable*/
      font-size: 12px;
      /*@editable*/
      line-height: 150%;
      /*@editable*/
      text-align: center;
    }

    /*
	@tab Footer
	@section Footer Link
	@tip Set the styling for your email's footer links. Choose a color that helps them stand out from your text.
	*/
    #templateFooter .mcnTextContent a,
    #templateFooter .mcnTextContent p a {
      /*@editable*/
      color: #222222;
      /*@editable*/
      font-weight: normal;
      /*@editable*/
      text-decoration: underline;
    }

    @media only screen and (min-width:768px) {
      .templateContainer {
        width: 600px !important;
      }

    }

    @media only screen and (max-width: 480px) {

      body,
      table,
      td,
      p,
      a,
      li,
      blockquote {
        -webkit-text-size-adjust: none !important;
      }

    }

    @media only screen and (max-width: 480px) {
      body {
        width: 100% !important;
        min-width: 100% !important;
      }

    }

    @media only screen and (max-width: 480px) {
      .mcnRetinaImage {
        max-width: 100% !important;
      }

    }

    @media only screen and (max-width: 480px) {
      .mcnImage {
        width: 100% !important;
      }

    }

    @media only screen and (max-width: 480px) {

      .mcnCartContainer,
      .mcnCaptionTopContent,
      .mcnRecContentContainer,
      .mcnCaptionBottomContent,
      .mcnTextContentContainer,
      .mcnBoxedTextContentContainer,
      .mcnImageGroupContentContainer,
      .mcnCaptionLeftTextContentContainer,
      .mcnCaptionRightTextContentContainer,
      .mcnCaptionLeftImageContentContainer,
      .mcnCaptionRightImageContentContainer,
      .mcnImageCardLeftTextContentContainer,
      .mcnImageCardRightTextContentContainer,
      .mcnImageCardLeftImageContentContainer,
      .mcnImageCardRightImageContentContainer {
        max-width: 100% !important;
        width: 100% !important;
      }

    }

    @media only screen and (max-width: 480px) {
      .mcnBoxedTextContentContainer {
        min-width: 100% !important;
      }

    }

    @media only screen and (max-width: 480px) {
      .mcnImageGroupContent {
        padding: 9px !important;
      }

    }

    @media only screen and (max-width: 480px) {

      .mcnCaptionLeftContentOuter .mcnTextContent,
      .mcnCaptionRightContentOuter .mcnTextContent {
        padding-top: 9px !important;
      }

    }

    @media only screen and (max-width: 480px) {

      .mcnImageCardTopImageContent,
      .mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,
      .mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent {
        padding-top: 18px !important;
      }

    }

    @media only screen and (max-width: 480px) {
      .mcnImageCardBottomImageContent {
        padding-bottom: 9px !important;
      }

    }

    @media only screen and (max-width: 480px) {
      .mcnImageGroupBlockInner {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }

    }

    @media only screen and (max-width: 480px) {
      .mcnImageGroupBlockOuter {
        padding-top: 9px !important;
        padding-bottom: 9px !important;
      }

    }

    @media only screen and (max-width: 480px) {

      .mcnTextContent,
      .mcnBoxedTextContentColumn {
        padding-right: 18px !important;
        padding-left: 18px !important;
      }

    }

    @media only screen and (max-width: 480px) {

      .mcnImageCardLeftImageContent,
      .mcnImageCardRightImageContent {
        padding-right: 18px !important;
        padding-bottom: 0 !important;
        padding-left: 18px !important;
      }

    }

    @media only screen and (max-width: 480px) {
      .mcpreview-image-uploader {
        display: none !important;
        width: 100% !important;
      }

    }

    @media only screen and (max-width: 480px) {

      /*
	@tab Mobile Styles
	@section Heading 1
	@tip Make the first-level headings larger in size for better readability on small screens.
	*/
      h1 {
        /*@editable*/
        font-size: 22px !important;
        /*@editable*/
        line-height: 125% !important;
      }

    }

    @media only screen and (max-width: 480px) {

      /*
	@tab Mobile Styles
	@section Heading 2
	@tip Make the second-level headings larger in size for better readability on small screens.
	*/
      h2 {
        /*@editable*/
        font-size: 20px !important;
        /*@editable*/
        line-height: 125% !important;
      }

    }

    @media only screen and (max-width: 480px) {

      /*
	@tab Mobile Styles
	@section Heading 3
	@tip Make the third-level headings larger in size for better readability on small screens.
	*/
      h3 {
        /*@editable*/
        font-size: 18px !important;
        /*@editable*/
        line-height: 125% !important;
      }

    }

    @media only screen and (max-width: 480px) {

      /*
	@tab Mobile Styles
	@section Heading 4
	@tip Make the fourth-level headings larger in size for better readability on small screens.
	*/
      h4 {
        /*@editable*/
        font-size: 16px !important;
        /*@editable*/
        line-height: 150% !important;
      }

    }

    @media only screen and (max-width: 480px) {

      /*
	@tab Mobile Styles
	@section Boxed Text
	@tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.
	*/
      .mcnBoxedTextContentContainer .mcnTextContent,
      .mcnBoxedTextContentContainer .mcnTextContent p {
        /*@editable*/
        font-size: 14px !important;
        /*@editable*/
        line-height: 150% !important;
      }

    }

    @media only screen and (max-width: 480px) {

      /*
	@tab Mobile Styles
	@section Preheader Visibility
	@tip Set the visibility of the email's preheader on small screens. You can hide it to save space.
	*/
      #templatePreheader {
        /*@editable*/
        display: block !important;
      }

    }

    @media only screen and (max-width: 480px) {

      /*
	@tab Mobile Styles
	@section Preheader Text
	@tip Make the preheader text larger in size for better readability on small screens.
	*/
      #templatePreheader .mcnTextContent,
      #templatePreheader .mcnTextContent p {
        /*@editable*/
        font-size: 14px !important;
        /*@editable*/
        line-height: 150% !important;
      }

    }

    @media only screen and (max-width: 480px) {

      /*
	@tab Mobile Styles
	@section Header Text
	@tip Make the header text larger in size for better readability on small screens.
	*/
      #templateHeader .mcnTextContent,
      #templateHeader .mcnTextContent p {
        /*@editable*/
        font-size: 16px !important;
        /*@editable*/
        line-height: 150% !important;
      }

    }

    @media only screen and (max-width: 480px) {

      /*
	@tab Mobile Styles
	@section Body Text
	@tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.
	*/
      #templateBody .mcnTextContent,
      #templateBody .mcnTextContent p {
        /*@editable*/
        font-size: 16px !important;
        /*@editable*/
        line-height: 150% !important;
      }

    }

    @media only screen and (max-width: 480px) {

      /*
	@tab Mobile Styles
	@section Footer Text
	@tip Make the footer content text larger in size for better readability on small screens.
	*/
      #templateFooter .mcnTextContent,
      #templateFooter .mcnTextContent p {
        /*@editable*/
        font-size: 14px !important;
        /*@editable*/
        line-height: 150% !important;
      }

    }
  </style>
</head>

<body>
  <!--*|IF:MC_PREVIEW_TEXT|*-->
  <!--[if !gte mso 9]><!----><span class="mcnPreviewText"
    style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">*|MC_PREVIEW_TEXT|*</span>
  <!--<![endif]-->
  <!--*|END:IF|*-->
  <center>
    <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
      <tr>
        <td align="center" valign="top" id="bodyCell">
          <!-- BEGIN TEMPLATE // -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" valign="top" id="templatePreheader">
                <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                  <tr>
                    <td valign="top" class="preheaderContainer">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                        style="min-width:100%;">
                        <tbody class="mcnTextBlockOuter">
                          <tr>
                            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                              <!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->

                              <!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                              <table align="left" border="0" cellpadding="0" cellspacing="0"
                                style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                  <tr>

                                    <td valign="top" class="mcnTextContent"
                                      style="padding: 0px 18px 9px; text-align: center;">

                                      <a href="*|ARCHIVE|*" target="_blank">View this email in your browser</a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if mso]>
				</td>
				<![endif]-->

                              <!--[if mso]>
				</tr>
				</table>
				<![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
              </td>
            </tr>
            <tr>
              <td align="center" valign="top" id="templateHeader">
                <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                  <tr>
                    <td valign="top" class="headerContainer">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock"
                        style="min-width:100%;">
                        <tbody class="mcnImageBlockOuter">
                          <tr>
                            <td valign="top" style="padding:9px" class="mcnImageBlockInner">
                              <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0"
                                class="mcnImageContentContainer" style="min-width:100%;">
                                <tbody>
                                  <tr>
                                    <td class="mcnImageContent" valign="top"
                                      style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">


                                      <img align="center" alt=""
                                        src="https://mcusercontent.com/322860999c315c08bcfb57c0c/images/ce2490b6-0db7-4145-ba4c-4e6fe2015016.png"
                                        width="564"
                                        style="max-width:8637px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                                        class="mcnImage">


                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock"
                        style="min-width:100%;">
                        <tbody class="mcnDividerBlockOuter">
                          <tr>
                            <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                              <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="min-width: 100%;border-top: 2px dashed #2A2A2A;">
                                <tbody>
                                  <tr>
                                    <td>
                                      <span></span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
              </td>
            </tr>
            <tr>
              <td align="center" valign="top" id="templateBody">
                <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                  <tr>
                    <td valign="top" class="bodyContainer">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                        style="min-width:100%;">
                        <tbody class="mcnTextBlockOuter">
                          <tr>
                            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                              <!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->

                              <!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                              <table align="left" border="0" cellpadding="0" cellspacing="0"
                                style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                  <tr>

                                    <td valign="top" class="mcnTextContent"
                                      style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

                                      &nbsp;
                                      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tbody>
                                          <tr>
                                            <td valign="top">
                                              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tbody>
                                                  <tr>
                                                    <td valign="top">
                                                      <table align="left" border="0" cellpadding="0" cellspacing="0"
                                                        width="100%">
                                                        <tbody>
                                                          <tr>
                                                            <td valign="top"><span
                                                                style="font-family:playfair display,georgia,times new roman,serif">Hey ${name}</span>

                                                              <p>
                                                                <font
                                                                  face="playfair display, georgia, times new roman, serif">
                                                                  Here are your meal selections for next week.&nbsp;If
                                                                  you have any queries or questions please just drop us
                                                                  an email at&nbsp;<a
                                                                    href="mailto:hello@thenutrtitionistmcr.com"
                                                                    target="_blank">hello@thenutritionistmcr.com</a>
                                                                </font><br>
                                                                &nbsp;
                                                              </p>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>

                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if mso]>
				</td>
				<![endif]-->

                              <!--[if mso]>
				</tr>
				</table>
				<![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                        style="min-width:100%;">
                        <tbody class="mcnTextBlockOuter">
                          <tr>
                            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                              <!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->

                              <!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                              <table align="left" border="0" cellpadding="0" cellspacing="0"
                                style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                  <tr>

                                    <td valign="top" class="mcnTextContent"
                                      style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

                                      ${deliveries.map(
                                        (delivery, index) => `
                                      <span
                                        style="font-family:arial,helvetica neue,helvetica,sans-serif"><strong>Delivery
                                          ${index + 1}</strong></span>
                                          <ul>
                                          ${delivery.map(
                                            (item) =>
                                              `<li><span style="font-family:arial,helvetica neue,helvetica,sans-serif">${
                                                isSelectedMeal(item)
                                                  ? item.recipe.name
                                                  : item.chosenVariant
                                              }</span></li>`
                                          )}
                                          </ul>
                                          `
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if mso]>
				</td>
				<![endif]-->

                              <!--[if mso]>
				</tr>
				</table>
				<![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock"
                        style="min-width:100%;">
                        <tbody class="mcnImageBlockOuter">
                          <tr>
                            <td valign="top" style="padding:9px" class="mcnImageBlockInner">
                              <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0"
                                class="mcnImageContentContainer" style="min-width:100%;">
                                <tbody>
                                  <tr>
                                    <td class="mcnImageContent" valign="top"
                                      style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">


                                      <img align="center" alt=""
                                        src="https://mcusercontent.com/322860999c315c08bcfb57c0c/_compresseds/437c63d0-ca95-98bf-7546-d270908f4ffa.jpg"
                                        width="564"
                                        style="max-width:4625px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                                        class="mcnImage">


                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock"
                        style="min-width:100%;">
                        <tbody class="mcnDividerBlockOuter">
                          <tr>
                            <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                              <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="min-width: 100%;border-top: 2px none #2A2A2A;">
                                <tbody>
                                  <tr>
                                    <td>
                                      <span></span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                        style="min-width:100%;">
                        <tbody class="mcnTextBlockOuter">
                          <tr>
                            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                              <!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->

                              <!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                              <table align="left" border="0" cellpadding="0" cellspacing="0"
                                style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                  <tr>

                                    <td valign="top" class="mcnTextContent"
                                      style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

                                      <span style="font-size:24px"><span
                                          style="font-family:helvetica neue,helvetica,arial,verdana,sans-serif"><strong>Heating
                                            your meals</strong></span></span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if mso]>
				</td>
				<![endif]-->

                              <!--[if mso]>
				</tr>
				</table>
				<![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock"
                        style="min-width:100%;">
                        <tbody class="mcnDividerBlockOuter">
                          <tr>
                            <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                              <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="min-width: 100%;border-top: 2px dashed #2A2A2A;">
                                <tbody>
                                  <tr>
                                    <td>
                                      <span></span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                        style="min-width:100%;">
                        <tbody class="mcnTextBlockOuter">
                          <tr>
                            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                              <!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->

                              <!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                              <table align="left" border="0" cellpadding="0" cellspacing="0"
                                style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                  <tr>

                                    <td valign="top" class="mcnTextContent"
                                      style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

                                      <font face="playfair display, georgia, times new roman, serif">For best results,
                                        we recommend reheating your meals in an 850W microwave using the <span
                                          style="font-family:playfair display,georgia,times new roman,serif">following
                                          guide:</span></font>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if mso]>
				</td>
				<![endif]-->

                              <!--[if mso]>
				</tr>
				</table>
				<![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock"
                        style="min-width:100%;">
                        <tbody class="mcnImageBlockOuter">
                          <tr>
                            <td valign="top" style="padding:9px" class="mcnImageBlockInner">
                              <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0"
                                class="mcnImageContentContainer" style="min-width:100%;">
                                <tbody>
                                  <tr>
                                    <td class="mcnImageContent" valign="top"
                                      style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">


                                      <img align="center" alt=""
                                        src="https://mcusercontent.com/322860999c315c08bcfb57c0c/images/a37ced7d-0220-ce60-b9b4-ef2a91a702b9.png"
                                        width="564"
                                        style="max-width:2002px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                                        class="mcnImage">


                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                        style="min-width:100%;">
                        <tbody class="mcnTextBlockOuter">
                          <tr>
                            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                              <!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->

                              <!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                              <table align="left" border="0" cellpadding="0" cellspacing="0"
                                style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                  <tr>

                                    <td valign="top" class="mcnTextContent"
                                      style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

                                      <br>
                                      <span style="font-family:playfair display,georgia,times new roman,serif">All
                                        appliances vary and this is a guide only. Always ensure food is piping hot
                                        throughout. Enjoy!</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if mso]>
				</td>
				<![endif]-->

                              <!--[if mso]>
				</tr>
				</table>
				<![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock"
                        style="min-width:100%;">
                        <tbody class="mcnDividerBlockOuter">
                          <tr>
                            <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                              <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="min-width: 100%;border-top: 2px none #EAEAEA;">
                                <tbody>
                                  <tr>
                                    <td>
                                      <span></span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                        style="min-width:100%;">
                        <tbody class="mcnTextBlockOuter">
                          <tr>
                            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                              <!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->

                              <!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                              <table align="left" border="0" cellpadding="0" cellspacing="0"
                                style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                  <tr>

                                    <td valign="top" class="mcnTextContent"
                                      style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

                                      <span style="font-size:24px"><span
                                          style="font-family:helvetica neue,helvetica,arial,verdana,sans-serif"><strong>Your
                                            Cool Bag</strong></span></span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if mso]>
				</td>
				<![endif]-->

                              <!--[if mso]>
				</tr>
				</table>
				<![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock"
                        style="min-width:100%;">
                        <tbody class="mcnDividerBlockOuter">
                          <tr>
                            <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                              <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="min-width: 100%;border-top: 2px dashed #2A2A2A;">
                                <tbody>
                                  <tr>
                                    <td>
                                      <span></span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                        style="min-width:100%;">
                        <tbody class="mcnTextBlockOuter">
                          <tr>
                            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                              <!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->

                              <!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                              <table align="left" border="0" cellpadding="0" cellspacing="0"
                                style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                  <tr>

                                    <td valign="top" class="mcnTextContent"
                                      style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

                                      <span style="font-family:playfair display,georgia,times new roman,serif">If we
                                        deliver your meals in a chilled cool bag, they'll stay fresh in the bag for up
                                        to 6 hours. For optimum freshness, we recommend storing them in the fridge as
                                        soon as you can.<br>
                                        <br>
                                        Please help us by returning your empty bags and defrosted gel ice packs, or
                                        leaving them in your delivery spot for us to collect.</span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if mso]>
				</td>
				<![endif]-->

                              <!--[if mso]>
				</tr>
				</table>
				<![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock"
                        style="min-width:100%;">
                        <tbody class="mcnImageBlockOuter">
                          <tr>
                            <td valign="top" style="padding:9px" class="mcnImageBlockInner">
                              <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0"
                                class="mcnImageContentContainer" style="min-width:100%;">
                                <tbody>
                                  <tr>
                                    <td class="mcnImageContent" valign="top"
                                      style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">


                                      <img align="center" alt=""
                                        src="https://mcusercontent.com/322860999c315c08bcfb57c0c/_compresseds/1861a8d0-a2b0-f192-3117-f99cca8e9c81.jpg"
                                        width="564"
                                        style="max-width:3024px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                                        class="mcnImage">


                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock"
                        style="min-width:100%;">
                        <tbody class="mcnDividerBlockOuter">
                          <tr>
                            <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                              <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="min-width: 100%;border-top: 2px none #2A2A2A;">
                                <tbody>
                                  <tr>
                                    <td>
                                      <span></span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                        style="min-width:100%;">
                        <tbody class="mcnTextBlockOuter">
                          <tr>
                            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                              <!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->

                              <!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                              <table align="left" border="0" cellpadding="0" cellspacing="0"
                                style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                  <tr>

                                    <td valign="top" class="mcnTextContent"
                                      style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

                                      <span style="font-size:24px"><span
                                          style="font-family:helvetica neue,helvetica,arial,verdana,sans-serif"><strong>Need
                                            to Pause?</strong></span></span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if mso]>
				</td>
				<![endif]-->

                              <!--[if mso]>
				</tr>
				</table>
				<![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock"
                        style="min-width:100%;">
                        <tbody class="mcnDividerBlockOuter">
                          <tr>
                            <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                              <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="min-width: 100%;border-top: 2px dashed #2A2A2A;">
                                <tbody>
                                  <tr>
                                    <td>
                                      <span></span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                        style="min-width:100%;">
                        <tbody class="mcnTextBlockOuter">
                          <tr>
                            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                              <!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->

                              <!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                              <table align="left" border="0" cellpadding="0" cellspacing="0"
                                style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                  <tr>

                                    <td valign="top" class="mcnTextContent"
                                      style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">

                                      <font face="playfair display, georgia, times new roman, serif">If you need to take
                                        a short break from your regular deliveries for any reason (such as you're going
                                        on holiday), that's no problem at all, please just drop us an email at least 1
                                        full week before your planned pause date, detailing the date you'd like to
                                        receive your final delivery, and the date you'd like your delivery to resume
                                        on.&nbsp;</font><br>
                                      <br>
                                      <span style="font-family:playfair display,georgia,times new roman,serif">Please
                                        email us at&nbsp;<a href="mailto:pauseme@thenutritionistmcr.com"
                                          target="_blank">pauseme@thenutritionistmcr.com</a></span><br>
                                      <br>
                                      <font face="playfair display, georgia, times new roman, serif">We'll confirm your
                                        request, and make sure the value of your pause duration is credited to your
                                        account and deducted from your next subscription months invoice.</font>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if mso]>
				</td>
				<![endif]-->

                              <!--[if mso]>
				</tr>
				</table>
				<![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock"
                        style="min-width:100%;">
                        <tbody class="mcnDividerBlockOuter">
                          <tr>
                            <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                              <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="min-width: 100%;border-top: 2px none #2A2A2A;">
                                <tbody>
                                  <tr>
                                    <td>
                                      <span></span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
              </td>
            </tr>
            <tr>
              <td align="center" valign="top" id="templateFooter">
                <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                  <tr>
                    <td valign="top" class="footerContainer">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowBlock"
                        style="min-width:100%;">
                        <tbody class="mcnFollowBlockOuter">
                          <tr>
                            <td align="center" valign="top" style="padding:9px" class="mcnFollowBlockInner">
                              <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                class="mcnFollowContentContainer" style="min-width:100%;">
                                <tbody>
                                  <tr>
                                    <td align="center" style="padding-left:9px;padding-right:9px;">
                                      <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                        style="min-width: 100%; border: 1px none;" class="mcnFollowContent">
                                        <tbody>
                                          <tr>
                                            <td align="center" valign="top"
                                              style="padding-top:9px; padding-right:9px; padding-left:9px;">
                                              <table align="center" border="0" cellpadding="0" cellspacing="0">
                                                <tbody>
                                                  <tr>
                                                    <td align="center" valign="top">
                                                      <!--[if mso]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                    <![endif]-->

                                                      <!--[if mso]>
                                        <td align="center" valign="top">
                                        <![endif]-->


                                                      <table align="left" border="0" cellpadding="0" cellspacing="0"
                                                        style="display:inline;">
                                                        <tbody>
                                                          <tr>
                                                            <td valign="top"
                                                              style="padding-right:10px; padding-bottom:9px;"
                                                              class="mcnFollowContentItemContainer">
                                                              <table border="0" cellpadding="0" cellspacing="0"
                                                                width="100%" class="mcnFollowContentItem">
                                                                <tbody>
                                                                  <tr>
                                                                    <td align="left" valign="middle"
                                                                      style="padding-top:5px; padding-right:10px; padding-bottom:5px; padding-left:9px;">
                                                                      <table align="left" border="0" cellpadding="0"
                                                                        cellspacing="0" width="">
                                                                        <tbody>
                                                                          <tr>


                                                                            <td align="left" valign="middle"
                                                                              class="mcnFollowTextContent"
                                                                              style="padding-left:5px;">
                                                                              <a href="https://www.facebook.com/thenutritionistmcr"
                                                                                target=""
                                                                                style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, Verdana, sans-serif;font-size: 18px;text-decoration: none;color: #2A2A2A;font-weight: bold;">Facebook</a>
                                                                            </td>

                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>

                                                      <!--[if mso]>
                                        </td>
                                        <![endif]-->

                                                      <!--[if mso]>
                                        <td align="center" valign="top">
                                        <![endif]-->


                                                      <table align="left" border="0" cellpadding="0" cellspacing="0"
                                                        style="display:inline;">
                                                        <tbody>
                                                          <tr>
                                                            <td valign="top"
                                                              style="padding-right:0; padding-bottom:9px;"
                                                              class="mcnFollowContentItemContainer">
                                                              <table border="0" cellpadding="0" cellspacing="0"
                                                                width="100%" class="mcnFollowContentItem">
                                                                <tbody>
                                                                  <tr>
                                                                    <td align="left" valign="middle"
                                                                      style="padding-top:5px; padding-right:10px; padding-bottom:5px; padding-left:9px;">
                                                                      <table align="left" border="0" cellpadding="0"
                                                                        cellspacing="0" width="">
                                                                        <tbody>
                                                                          <tr>


                                                                            <td align="left" valign="middle"
                                                                              class="mcnFollowTextContent"
                                                                              style="padding-left:5px;">
                                                                              <a href="https://www.instagram.com/thenutritionistmcr/"
                                                                                target=""
                                                                                style="font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, Verdana, sans-serif;font-size: 18px;text-decoration: none;color: #2A2A2A;font-weight: bold;">Instagram</a>
                                                                            </td>

                                                                          </tr>
                                                                        </tbody>
                                                                      </table>
                                                                    </td>
                                                                  </tr>
                                                                </tbody>
                                                              </table>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>

                                                      <!--[if mso]>
                                        </td>
                                        <![endif]-->

                                                      <!--[if mso]>
                                    </tr>
                                    </table>
                                    <![endif]-->
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock"
                        style="min-width:100%;">
                        <tbody class="mcnDividerBlockOuter">
                          <tr>
                            <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                              <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="min-width: 100%;border-top: 2px dashed #000000;">
                                <tbody>
                                  <tr>
                                    <td>
                                      <span></span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--            
                <td class="mcnDividerBlockInner" style="padding: 18px;">
                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock"
                        style="min-width:100%;">
                        <tbody class="mcnTextBlockOuter">
                          <tr>
                            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                              <!--[if mso]>
				<table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
				<tr>
				<![endif]-->

                              <!--[if mso]>
				<td valign="top" width="600" style="width:600px;">
				<![endif]-->
                              <table align="left" border="0" cellpadding="0" cellspacing="0"
                                style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                  <tr>

                                    <td valign="top" class="mcnTextContent"
                                      style="padding: 0px 18px 9px;color: #2A2A2A;">

                                      <em>Copyright © *|CURRENT_YEAR|* *|LIST:COMPANY|*, All rights reserved.</em><br>
                                      *|IFNOT:ARCHIVE_PAGE|* *|LIST:DESCRIPTION|*<br>
                                      <br>
                                      <strong>Our mailing address is:</strong><br>
                                      *|HTML:LIST_ADDRESS_HTML|* *|END:IF|*<br>
                                      <br>
                                      Want to change how you receive these emails?<br>
                                      You can <a href="*|UPDATE_PROFILE|*">update your preferences</a> or <a
                                        href="*|UNSUB|*">unsubscribe from this list</a>.<br>
                                      <br>
                                      *|IF:REWARDS|* *|HTML:REWARDS|* *|END:IF|*
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <!--[if mso]>
				</td>
				<![endif]-->

                              <!--[if mso]>
				</tr>
				</table>
				<![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
              </td>
            </tr>
          </table>
          <!-- // END TEMPLATE -->
        </td>
      </tr>
    </table>
  </center>
  <script type="text/javascript" src="/UJhxZmBokkB9/qHf_zt/JrfmGZ/uab5m2c0/AHckAWsB/YCUbC/WN4URs"></script>
</body>

</html>
`;

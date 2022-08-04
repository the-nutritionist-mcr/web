export const makeEmail = (
  firstName: string,
  username: string,
  password: string,
  url: string
) => `
<html> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <title>*|MC:SUBJECT|*</title> <style type="text/css"> p{margin: 10px 0; padding: 0;}table{border-collapse: collapse;}h1, h2, h3, h4, h5, h6{display: block; margin: 0; padding: 0;}img, a img{border: 0; height: auto; outline: none; text-decoration: none;}body, #bodyTable, #bodyCell{height: 100%; margin: 0; padding: 0; width: 100%;}.mcnPreviewText{display: none !important;}#outlook a{padding: 0;}img{-ms-interpolation-mode: bicubic;}table{mso-table-lspace: 0pt; mso-table-rspace: 0pt;}.ReadMsgBody{width: 100%;}.ExternalClass{width: 100%;}p, a, li, td, blockquote{mso-line-height-rule: exactly;}a[href^=tel], a[href^=sms]{color: inherit; cursor: default; text-decoration: none;}p, a, li, td, body, table, blockquote{-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}.ExternalClass, .ExternalClass p, .ExternalClass td, .ExternalClass div, .ExternalClass span, .ExternalClass font{line-height: 100%;}a[x-apple-data-detectors]{color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important;}.templateContainer{max-width: 600px !important;}a.mcnButton{display: block;}.mcnImage, .mcnRetinaImage{vertical-align: bottom;}.mcnTextContent{word-break: break-word;}.mcnTextContent img{height: auto !important;}.mcnDividerBlock{table-layout: fixed !important;}body, #bodyTable{background-color: #FAFAFA;}#bodyCell{border-top: 0;}h1{color: #202020; font-family: Helvetica; font-size: 26px; font-style: normal; font-weight: bold; line-height: 125%; letter-spacing: normal; text-align: left;}h2{color: #202020; font-family: Helvetica; font-size: 22px; font-style: normal; font-weight: bold; line-height: 125%; letter-spacing: normal; text-align: left;}h3{color: #202020; font-family: Helvetica; font-size: 20px; font-style: normal; font-weight: bold; line-height: 125%; letter-spacing: normal; text-align: left;}h4{color: #202020; font-family: Helvetica; font-size: 18px; font-style: normal; font-weight: bold; line-height: 125%; letter-spacing: normal; text-align: left;}#templatePreheader{background-color: #FAFAFA; background-image: none; background-repeat: no-repeat; background-position: center; background-size: cover; border-top: 0; border-bottom: 0; padding-top: 9px; padding-bottom: 9px;}#templatePreheader .mcnTextContent, #templatePreheader .mcnTextContent p{color: #656565; font-family: Helvetica; font-size: 12px; line-height: 150%; text-align: left;}#templatePreheader .mcnTextContent a, #templatePreheader .mcnTextContent p a{color: #656565; font-weight: normal; text-decoration: underline;}#templateHeader{background-color: #FFFFFF; background-image: none; background-repeat: no-repeat; background-position: center; background-size: cover; border-top: 0; border-bottom: 0; padding-top: 9px; padding-bottom: 0;}#templateHeader .mcnTextContent, #templateHeader .mcnTextContent p{color: #202020; font-family: Helvetica; font-size: 16px; line-height: 150%; text-align: left;}#templateHeader .mcnTextContent a, #templateHeader .mcnTextContent p a{color: #007C89; font-weight: normal; text-decoration: underline;}#templateBody{background-color: #FFFFFF; background-image: none; background-repeat: no-repeat; background-position: center; background-size: cover; border-top: 0; border-bottom: 0; padding-top: 9px; padding-bottom: 9px;}#templateBody .mcnTextContent, #templateBody .mcnTextContent p{color: #202020; font-family: Helvetica; font-size: 16px; line-height: 150%; text-align: left;}#templateBody .mcnTextContent a, #templateBody .mcnTextContent p a{color: #007C89; font-weight: normal; text-decoration: underline;}#templateFooter{background-color: #ffa397; background-image: none; background-repeat: no-repeat; background-position: center; background-size: cover; border-top: 0; border-bottom: 0; padding-top: 20px; padding-bottom: 30px;}#templateFooter .mcnTextContent, #templateFooter .mcnTextContent p{color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, Verdana, sans-serif; font-size: 12px; line-height: 150%; text-align: center;}#templateFooter .mcnTextContent a, #templateFooter .mcnTextContent p a{color: #222222; font-weight: normal; text-decoration: underline;}@media only screen and (min-width:768px){.templateContainer{width: 600px !important;}}@media only screen and (max-width: 480px){body, table, td, p, a, li, blockquote{-webkit-text-size-adjust: none !important;}}@media only screen and (max-width: 480px){body{width: 100% !important; min-width: 100% !important;}}@media only screen and (max-width: 480px){.mcnRetinaImage{max-width: 100% !important;}}@media only screen and (max-width: 480px){.mcnImage{width: 100% !important;}}@media only screen and (max-width: 480px){.mcnCartContainer, .mcnCaptionTopContent, .mcnRecContentContainer, .mcnCaptionBottomContent, .mcnTextContentContainer, .mcnBoxedTextContentContainer, .mcnImageGroupContentContainer, .mcnCaptionLeftTextContentContainer, .mcnCaptionRightTextContentContainer, .mcnCaptionLeftImageContentContainer, .mcnCaptionRightImageContentContainer, .mcnImageCardLeftTextContentContainer, .mcnImageCardRightTextContentContainer, .mcnImageCardLeftImageContentContainer, .mcnImageCardRightImageContentContainer{max-width: 100% !important; width: 100% !important;}}@media only screen and (max-width: 480px){.mcnBoxedTextContentContainer{min-width: 100% !important;}}@media only screen and (max-width: 480px){.mcnImageGroupContent{padding: 9px !important;}}@media only screen and (max-width: 480px){.mcnCaptionLeftContentOuter .mcnTextContent, .mcnCaptionRightContentOuter .mcnTextContent{padding-top: 9px !important;}}@media only screen and (max-width: 480px){.mcnImageCardTopImageContent, .mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent, .mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{padding-top: 18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardBottomImageContent{padding-bottom: 9px !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockInner{padding-top: 0 !important; padding-bottom: 0 !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockOuter{padding-top: 9px !important; padding-bottom: 9px !important;}}@media only screen and (max-width: 480px){.mcnTextContent, .mcnBoxedTextContentColumn{padding-right: 18px !important; padding-left: 18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardLeftImageContent, .mcnImageCardRightImageContent{padding-right: 18px !important; padding-bottom: 0 !important; padding-left: 18px !important;}}@media only screen and (max-width: 480px){.mcpreview-image-uploader{display: none !important; width: 100% !important;}}@media only screen and (max-width: 480px){h1{font-size: 22px !important; line-height: 125% !important;}}@media only screen and (max-width: 480px){h2{font-size: 20px !important; line-height: 125% !important;}}@media only screen and (max-width: 480px){h3{font-size: 18px !important; line-height: 125% !important;}}@media only screen and (max-width: 480px){h4{/*@editable*/ font-size: 16px !important; /*@editable*/ line-height: 150% !important;}}@media only screen and (max-width: 480px){.mcnBoxedTextContentContainer .mcnTextContent, .mcnBoxedTextContentContainer .mcnTextContent p{font-size: 14px !important; line-height: 150% !important;}}@media only screen and (max-width: 480px){#templatePreheader{display: block !important;}}@media only screen and (max-width: 480px){#templatePreheader .mcnTextContent, #templatePreheader .mcnTextContent p{font-size: 14px !important; line-height: 150% !important;}}@media only screen and (max-width: 480px){#templateHeader .mcnTextContent, #templateHeader .mcnTextContent p{font-size: 16px !important; line-height: 150% !important;}}@media only screen and (max-width: 480px){#templateBody .mcnTextContent, #templateBody .mcnTextContent p{font-size: 16px !important; line-height: 150% !important;}}@media only screen and (max-width: 480px){#templateFooter .mcnTextContent, #templateFooter .mcnTextContent p{font-size: 14px !important; line-height: 150% !important;}}</style></head><body> <span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">Welcome to the TNM portal</span> <center> <table id="bodyTable" width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" align="center"> <tbody> <tr> <td id="bodyCell" valign="top" align="center"> <table width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody> <tr> <td id="templateHeader" valign="top" align="center"> <table class="templateContainer" width="100%" cellspacing="0" cellpadding="0" border="0" align="center"> <tbody> <tr> <td class="headerContainer" valign="top"> <table class="mcnImageBlock" style="min-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody class="mcnImageBlockOuter"> <tr> <td style="padding:9px" class="mcnImageBlockInner" valign="top"> <table class="mcnImageContentContainer" style="min-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0" align="left"> <tbody> <tr> <td class="mcnImageContent" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;" valign="top"> <img alt="" src="https://mcusercontent.com/322860999c315c08bcfb57c0c/images/ce2490b6-0db7-4145-ba4c-4e6fe2015016.png" style="max-width:8637px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage" width="564" align="middle"> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="mcnDividerBlock" style="min-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody class="mcnDividerBlockOuter"> <tr> <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;"> <table class="mcnDividerContent" style="min-width: 100%;border-top: 2px dashed #2A2A2A;" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody> <tr> <td> <span></span> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr><tr> <td id="templateBody" valign="top" align="center"> <table class="templateContainer" width="100%" cellspacing="0" cellpadding="0" border="0" align="center"> <tbody> <tr> <td class="bodyContainer" valign="top"> <table class="mcnTextBlock" style="min-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody class="mcnTextBlockOuter"> <tr> <td class="mcnTextBlockInner" style="padding-top:9px;" valign="top"> <table style="max-width:100%; min-width:100%;" class="mcnTextContentContainer" width="100%" cellspacing="0" cellpadding="0" border="0" align="left"> <tbody> <tr> <td class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;" valign="top"> <h1 class="null" style="text-align: left;"><span style="font-size:26px"><strong> <font face="playfair display, georgia, times new roman, serif"><span style="font-family:arial,helvetica neue,helvetica,sans-serif">Welcome to your personal Members Area</span></font> </strong></span></h1> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="mcnTextBlock" style="min-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody class="mcnTextBlockOuter"> <tr> <td class="mcnTextBlockInner" style="padding-top:9px;" valign="top"> <table style="max-width:100%; min-width:100%;" class="mcnTextContentContainer" width="100%" cellspacing="0" cellpadding="0" border="0" align="left"> <tbody> <tr> <td class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;" valign="top"> <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center"> <tbody> <tr> <td valign="top"> <table width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody> <tr> <td valign="top"> <table width="100%" cellspacing="0" cellpadding="0" border="0" align="left"> <tbody> <tr> <td valign="top"> <h1><br>Hey ${firstName},</h1> &nbsp; <p> <font face="playfair display, georgia, times new roman, serif"> You'll now be able to login, view&nbsp;your&nbsp;fresh weekly menu, and choose exactly what you receive in your two fresh deliveries.</font> </p></td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="mcnDividerBlock" style="min-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody class="mcnDividerBlockOuter"> <tr> <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;"> <table class="mcnDividerContent" style="min-width: 100%;border-top: 2px none #2A2A2A;" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody> <tr> <td> <span></span> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="mcnImageBlock" style="min-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody class="mcnImageBlockOuter"> <tr> <td style="padding:9px" class="mcnImageBlockInner" valign="top"> <table class="mcnImageContentContainer" style="min-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0" align="left"> <tbody> <tr> <td class="mcnImageContent" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;" valign="top"> <img alt="" src="https://mcusercontent.com/322860999c315c08bcfb57c0c/_compresseds/1861a8d0-a2b0-f192-3117-f99cca8e9c81.jpg" style="max-width:3024px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage" width="564" align="middle"> </td></tr></tbody> </table> </td></tr></tbody></table> <table class="mcnDividerBlock" style="min-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody class="mcnDividerBlockOuter"> <tr> <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;"> <table class="mcnDividerContent" style="min-width: 100%;border-top: 2px none #2A2A2A;" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody> <tr> <td> <span></span> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="mcnTextBlock" style="min-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody class="mcnTextBlockOuter"> <tr> <td class="mcnTextBlockInner" style="padding-top:9px;" valign="top"> <table style="max-width:100%; min-width:100%;" class="mcnTextContentContainer" width="100%" cellspacing="0" cellpadding="0" border="0" align="left"> <tbody> <tr> <td class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;" valign="top"> <span style="font-size:24px"><span style="font-family:helvetica neue,helvetica,arial,verdana,sans-serif"><strong>Logging In</strong></span></span> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="mcnDividerBlock" style="min-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody class="mcnDividerBlockOuter"> <tr> <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;"> <table class="mcnDividerContent" style="min-width: 100%;border-top: 2px dashed #2A2A2A;" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody> <tr> <td> <span></span> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="mcnTextBlock" style="min-width:100%;" width="100%" cellspacing="0" cellpadding="0" border="0"> <tbody class="mcnTextBlockOuter"> <tr> <td class="mcnTextBlockInner" style="padding-top:9px;" valign="top"> <table style="max-width:100%; min-width:100%;" class="mcnTextContentContainer" width="100%" cellspacing="0" cellpadding="0" border="0" align="left"> <tbody> <tr> <td class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;" valign="top"> <ul> <li><span style="font-family:playfair display,georgia,times new roman,serif">Click <a href="${url}/login" target="_blank">here</a> to visit your&nbsp;members area of thenutritionistmcr.com</span></li><li><span style="font-family:playfair display,georgia,times new roman,serif">Enter the password: <strong>${password}</strong> and hit&nbsp;login</span> </li><li><span style="font-family:playfair display,georgia,times new roman,serif">On your first time logging in, you'll be prompted to change the password to something more memorable for you</span></li></ul> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </center> <script type="text/javascript" src="/UJhxZmBokkB9/qHf_zt/JrfmGZ/uab5m2c0/AHckAWsB/YCUbC/WN4URs"></script> <p style='display:none' class='username'>${username}</p><p style='display:none' class='environment'>${process.env.ENVIRONMENT}</p></body></html>`;

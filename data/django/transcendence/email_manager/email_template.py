def generate_email(title, body, link, company):
    mail = f'<!DOCTYPE html>\
            <html lang="it">\
            <head>\
              <meta charset="UTF-8">\
              <title>Template email</title>\
            </head>\
            <body>\
\
              <table width="100%" border="0" cellspacing="0" cellpadding="0">\
                <tr>\
                  <td width="100%" align="center" valign="top">\
                    <table width="600" border="0" cellspacing="0" cellpadding="0" class="header">\
                      <tr>\
                        <td width="100%" align="center" valign="top">\
                          <h1>{title}</h1>\
                        </td>\
                      </tr>\
                    </table>\
                  </td>\
                </tr>\
              </table>\
\
              <table width="100%" border="0" cellspacing="0" cellpadding="0">\
                <tr>\
                  <td width="100%" align="center" valign="top">\
                    <table width="600" border="0" cellspacing="0" cellpadding="0" class="body">\
                      <tr>\
                        <td width="100%" align="left" valign="top">\
                          <p>{body}</p>\
                        </td>\
                      </tr>\
                    </table>\
                  </td>\
                </tr>\
              </table>\
\
              <table width="100%" border="0" cellspacing="0" cellpadding="0">\
                <tr>\
                  <td width="100%" align="center" valign="top">\
                    <table width="600" border="0" cellspacing="0" cellpadding="0" class="call-to-action">\
                      <tr>\
                        <td width="100%" align="center" valign="top">\
                          <a href="{link}" class="button">Click here</a>\
                        </td>\
                      </tr>\
                    </table>\
                  </td>\
                </tr>\
              </table>\
\
              <table width="100%" border="0" cellspacing="0" cellpadding="0">\
                <tr>\
                  <td width="100%" align="center" valign="top">\
                    <table width="600" border="0" cellspacing="0" cellpadding="0" class="footer">\
                      <tr>\
                        <td width="100%" align="center" valign="top">\
                          <p>Copyright © 2023, {company}</p>\
                        </td>\
                      </tr>\
                    </table>\
                  </td>\
                </tr>\
              </table>\
\
            </body>\
            </html>'
    return mail

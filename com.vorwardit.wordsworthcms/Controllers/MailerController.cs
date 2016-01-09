using MailChimp;
using MailChimp.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms.Controllers
{
    public class MailerController : Controller
    {
        [HttpPost]
        public ActionResult Send()
        {
            Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo("de");

            var api = new MandrillApi("VVWfyUXm5J4ZJVZ8ziOVzA");
            var recipients = new List<Mandrill.Messages.Recipient>();
            recipients.Add(new Mandrill.Messages.Recipient("info@paulfaehrtbus.de", "PAUL Kontakt Formular"));

            string body = "";

            foreach (string key in Request.Form)
            {
                var value = Request.Form[key];
                body += key + System.Environment.NewLine;
                body += value + System.Environment.NewLine + System.Environment.NewLine;
            }

            var msg = new Mandrill.Messages.Message()
            {
                To = recipients.ToArray(),
                FromEmail = "no-reply@paulfaehrtbus.de",
                Subject = "PAUL WebFormular",
                Text = body
            };
            api.Send(msg);

            return Json(new { success = true });
        }
    }
}
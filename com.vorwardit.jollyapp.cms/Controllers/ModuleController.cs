using com.vorwardit.jollyapp.cms.Modules;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.jollyapp.cms.Controllers
{
    public class ModuleController : BaseController
    {
        public ActionResult RenderModule(Guid pageVersionId, string position)
        {
            var pageVersion = db.PageVersions.Find(pageVersionId);
            MvcHtmlString actionresult = MvcHtmlString.Create("");
            var moduledata = pageVersion.ModuleData.FirstOrDefault(md => md.Position == position);
            if (moduledata != null)
            {
                switch (moduledata.Type)
                {
                    case "imagebanner":
                        return DependencyResolver.Current
                            .GetService<ImageBannerController>()
                            .Index(pageVersionId, position);

                    case "content":
                        return Content(moduledata.Data);
                }
            }

            return Content("");
        }

        public ActionResult PageEditor(Guid pageVersionId)
        {
            return PartialView();
        }
    }
}
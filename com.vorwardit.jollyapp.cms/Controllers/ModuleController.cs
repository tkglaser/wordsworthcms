using com.vorwardit.jollyapp.cms.Modules;
using com.vorwardit.jollyapp.cms.Modules.Core;
using com.vorwardit.jollyapp.cms.ViewModels;
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
            var moduledata = pageVersion.ModuleData.FirstOrDefault(md => md.Position == position);
            if (moduledata != null)
            {
				return ModuleFinder.Find(moduledata.Type)?.Index(pageVersionId, position);
            }

            return Content("");
        }

        public ActionResult PageEditor(Guid pageVersionId)
        {
			ViewBag.PageVersionId = pageVersionId;

			return PartialView();
        }

		[AcceptVerbs(HttpVerbs.Get)]
		public ActionResult GetModuleData(Guid pageVersionId, string position)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			return Content(pageVersion.Body, "application/json");
		}

		public ActionResult EditModuleType(Guid pageVersionId, string position)
		{
			var model = new EditModuleModel
			{
				Modules = ModuleFinder.GetAllModules()
			};
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var moduledata = pageVersion.ModuleData.FirstOrDefault(md => md.Position == position);
			if (moduledata != null)
			{
				model.selectedModule = moduledata.Type;
			}
			return PartialView(model);
		}

		[HttpPost]
		public ActionResult EditModuleType(Guid pageVersionId, string position, EditModuleModel model)
		{
			// TODO: save that
			return Content("ok");
		}

		public ActionResult EditModuleSettings(Guid pageVersionId, string position)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var moduledata = pageVersion.ModuleData.FirstOrDefault(md => md.Position == position);
			if (moduledata != null)
			{
				return ModuleFinder.Find(moduledata.Type)?.Edit(pageVersionId, position);
			}

			return Content("");
		}

		[HttpPost]
		public ActionResult EditModuleSettings(Guid pageVersionId, string position, object model)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var moduledata = pageVersion.ModuleData.FirstOrDefault(md => md.Position == position);
			if (moduledata != null)
			{
				return ModuleFinder.Find(moduledata.Type)?.Save(pageVersionId, position, Request.Form);
			}
			return Content("ok");
		}
	}
}
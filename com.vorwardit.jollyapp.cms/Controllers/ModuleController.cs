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
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var model = new EditModuleModel
			{
				Modules = ModuleFinder.GetAllModules(),
				selectedModule = pageVersion.GetModule(position).Type
			};
			return PartialView(model);
		}

		[HttpPost]
		public ActionResult EditModuleType(Guid pageVersionId, string position, EditModuleModel model)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var md = pageVersion.GetModule(position);
			md.Type = model.selectedModule;
			pageVersion.SetModule(position, md);
			db.SaveChanges();
			return Content("ok");
		}

		public ActionResult EditModuleSettings(Guid pageVersionId, string position)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var md = pageVersion.GetModule(position);
			db.SaveChanges(); // in case the json was newly created
			return ModuleFinder.Find(md.Type)?.Edit(pageVersionId, position);
		}

		[HttpPost]
		public ActionResult EditModuleSettings(Guid pageVersionId, string position, object model)
		{
			var pageVersion = db.PageVersions.Find(pageVersionId);
			var md = pageVersion.GetModule(position);
			db.SaveChanges(); // in case the json was newly created
			return ModuleFinder.Find(md.Type)?.Save(pageVersionId, position, Request.Form);
		}
	}
}
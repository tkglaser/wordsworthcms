using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using com.vorwardit.wordsworthcms.Modules;
using com.vorwardit.wordsworthcms.Modules.Core;
using com.vorwardit.wordsworthcms.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms.Controllers
{
    public class ModuleController : Controller
    {
        private IPageService pageService;

        public ModuleController(IPageService pageService)
        {
            this.pageService = pageService;
        }

        public ActionResult RenderModule(Guid pageVersionId, string position)
        {
            var pageVersion = pageService.GetPageVersion(pageVersionId);
            var moduledata = pageVersion.ModuleData.FirstOrDefault(md => md.Position == position);
            if (moduledata != null)
            {
				var isEditor = Request.IsAjaxRequest();
				return ModuleFinder.Find(moduledata.Type)?.Index(pageVersionId, position, isEditor);
            }

            return Content("");
        }

        public ActionResult PageEditor(Guid pageVersionId)
        {
			ViewBag.PageVersionId = pageVersionId;

			return PartialView();
        }

		[AcceptVerbs(HttpVerbs.Get)]
		public async Task<ActionResult> GetModuleData(Guid pageVersionId, string position)
		{
            var pageVersion = await pageService.GetPageVersionAsync(pageVersionId);
            return Content(pageVersion.Body, "application/json");
		}

		public async Task<ActionResult> EditModuleType(Guid pageVersionId, string position)
		{
            var pageVersion = await pageService.GetPageVersionAsync(pageVersionId);
            var model = new EditModuleModel
			{
				Modules = ModuleFinder.GetAllModules(),
				selectedModule = pageVersion.GetModule(position).Type
			};
			return PartialView(model);
		}

		[HttpPost]
		public async Task<ActionResult> EditModuleType(Guid pageVersionId, string position, EditModuleModel model)
		{
            var pageVersion = await pageService.GetPageVersionAsync(pageVersionId);
            var md = pageVersion.GetModule(position);
			md.Type = model.selectedModule;
			pageVersion.SetModule(position, md);
            await pageService.UpdateAsync(pageVersion);
			return Content("ok");
		}

		public async Task<ActionResult> EditModuleSettings(Guid pageVersionId, string position)
		{
            var pageVersion = await pageService.GetPageVersionAsync(pageVersionId);
            var md = pageVersion.GetModule(position);
            await pageService.UpdateAsync(pageVersion);
            return await ModuleFinder.Find(md.Type)?.Edit(pageVersionId, position);
		}

		[HttpPost]
		[ValidateInput(false)]
		public async Task<ActionResult> EditModuleSettings(Guid pageVersionId, string position, object model)
		{
            var pageVersion = await pageService.GetPageVersionAsync(pageVersionId);
            var md = pageVersion.GetModule(position);
            await pageService.UpdateAsync(pageVersion);
            return await ModuleFinder.Find(md.Type)?.Save(pageVersionId, position, Request.Form);
		}
	}
}
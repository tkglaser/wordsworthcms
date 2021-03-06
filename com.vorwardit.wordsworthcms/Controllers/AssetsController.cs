﻿using com.vorwardit.wordsworthcms.BusinessLogic.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms.Controllers
{
    public class AssetController : Controller
    {
        ISiteService siteService;
        IAzureStorageService storage;

        public AssetController(IAzureStorageService storage, ISiteService siteService)
        {
            this.storage = storage;
            this.siteService = siteService;
        }

        // GET: Assets
        public async Task<ActionResult> Index(string name)
        {
            var currentSite = await siteService.GetByHostnameAsync(Request.Url.DnsSafeHost);
            if (currentSite == null)
            {
                return HttpNotFound();
            }

            Stream result = new MemoryStream();
            string contentType = await storage.GetFileAsync(currentSite.SiteId.ToString(), name, result);
            result.Seek(0, SeekOrigin.Begin);
            if (string.IsNullOrEmpty(contentType))
            {
                return HttpNotFound();
            }
            return File(result, contentType);
        }
    }
}
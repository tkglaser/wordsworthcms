using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms.Modules.Core
{
	public class ModuleCacheEntry
	{
		public string Key { get; set; }
		public Type Type { get; set; }
		public string FriendlyName { get; set; }
	}

    public class ModuleFinder
    {
		private static ConcurrentDictionary<string, ModuleCacheEntry> TypeCache = new ConcurrentDictionary<string, ModuleCacheEntry>();

		public static void Init()
		{
			foreach (var kvp in from t in Assembly.GetExecutingAssembly().GetTypes()
								let ma = (ModuleAttribute)t.GetCustomAttributes(typeof(ModuleAttribute), true).FirstOrDefault()
								where t.GetInterfaces().Contains(typeof(IModule))
								where ma != null
								select new ModuleCacheEntry
								{
									Key = t.Name.ToLower().Replace("controller", ""),
									Type = t,
									FriendlyName = ma.Friendlyname
								})
			{
				TypeCache[kvp.Key] = kvp;
			}
		}

		public static IModule Find(string tag)
		{
			Type controllerType = TypeCache[tag].Type;
			return (IModule)DependencyResolver.Current.GetService(controllerType);
		}

		public static ICollection<ModuleCacheEntry> GetAllModules()
		{
			return TypeCache.Values;
		}
	}
}
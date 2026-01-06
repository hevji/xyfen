--// Clipboard (safe)
pcall(function()
    if setclipboard then
        setclipboard("https://discord.gg/f5YWtcMGhX")
    end
end)

--// Services
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local HttpService = game:GetService("HttpService")

local player = Players.LocalPlayer
local PlayerScripts = player:WaitForChild("PlayerScripts")
local Controllers = PlayerScripts:WaitForChild("Controllers")

--// Disable ReplicatedFirst junk
pcall(function()
    local RF = game:GetService("ReplicatedFirst")
    for _, v in ipairs(RF:GetChildren()) do
        if v:IsA("LocalScript") then
            v:Destroy()
        end
    end
    local analytics = RF:FindFirstChild("AnalyticsPipelineController")
    if analytics then analytics:Destroy() end
end)

--// Libraries
local EnumLibrary = require(ReplicatedStorage.Modules:WaitForChild("EnumLibrary"))
EnumLibrary:WaitForEnumBuilder()

local CosmeticLibrary = require(ReplicatedStorage.Modules:WaitForChild("CosmeticLibrary"))
local ItemLibrary = require(ReplicatedStorage.Modules:WaitForChild("ItemLibrary"))
local DataController = require(Controllers:WaitForChild("PlayerDataController"))

--// State
local equipped = {}
local favorites = {}
local lastUsedWeapon
local viewingProfile
local constructingWeapon

--// Cosmetic cloning
local function cloneCosmetic(name, cosmeticType, opts)
    local base = CosmeticLibrary.Cosmetics[name]
    if not base then return end

    local data = table.clone(base)
    data.Name = name
    data.Type = data.Type or cosmeticType
    data.Seed = data.Seed or math.random(1, 1e6)

    local ok, enum = pcall(function()
        return EnumLibrary:ToEnum(name)
    end)
    if ok and enum then
        data.Enum = enum
        data.ObjectID = data.ObjectID or enum
    end

    if opts then
        data.Inverted = opts.inverted
        data.OnlyUseFavorites = opts.favoritesOnly
    end

    return data
end

--// Config
local DIR = "unlockall"
local FILE = DIR .. "/config.json"

local function saveConfig()
    if not writefile then return end
    pcall(function()
        if not isfolder(DIR) then
            makefolder(DIR)
        end

        local out = {equipped = {}, favorites = favorites}

        for weapon, cos in pairs(equipped) do
            out.equipped[weapon] = {}
            for cType, cData in pairs(cos) do
                out.equipped[weapon][cType] = {
                    name = cData.Name,
                    seed = cData.Seed,
                    inverted = cData.Inverted
                }
            end
        end

        writefile(FILE, HttpService:JSONEncode(out))
    end)
end

local function loadConfig()
    if not (readfile and isfile and isfile(FILE)) then return end
    pcall(function()
        local cfg = HttpService:JSONDecode(readfile(FILE))
        favorites = cfg.favorites or {}

        for weapon, cos in pairs(cfg.equipped or {}) do
            equipped[weapon] = {}
            for cType, cData in pairs(cos) do
                local c = cloneCosmetic(cData.name, cType, {inverted = cData.inverted})
                if c then
                    c.Seed = cData.seed
                    equipped[weapon][cType] = c
                end
            end
        end
    end)
end

--// Ownership bypass
CosmeticLibrary.OwnsCosmeticNormally = function() return true end
CosmeticLibrary.OwnsCosmeticUniversally = function() return true end
CosmeticLibrary.OwnsCosmeticForWeapon = function() return true end

local originalOwns = CosmeticLibrary.OwnsCosmetic
CosmeticLibrary.OwnsCosmetic = function(self, inv, name, weapon)
    if name and name:find("MISSING_") then
        return originalOwns(self, inv, name, weapon)
    end
    return true
end

--// DataController spoof
local originalGet = DataController.Get
DataController.Get = function(self, key)
    local data = originalGet(self, key)

    if key == "CosmeticInventory" then
        return setmetatable({}, {__index = function() return true end})
    end

    if key == "FavoritedCosmetics" then
        local out = data and table.clone(data) or {}
        for w, f in pairs(favorites) do
            out[w] = out[w] or {}
            for n, v in pairs(f) do
                out[w][n] = v
            end
        end
        return out
    end

    return data
end

--// Weapon data merge
local originalGetWeaponData = DataController.GetWeaponData
DataController.GetWeaponData = function(self, weapon)
    local data = originalGetWeaponData(self, weapon)
    if not data then return end

    local merged = table.clone(data)
    merged.Name = weapon

    if equipped[weapon] then
        for k, v in pairs(equipped[weapon]) do
            merged[k] = v
        end
    end

    return merged
end

--// FighterController
local FighterController
pcall(function()
    FighterController = require(Controllers:WaitForChild("FighterController"))
end)

--// Remote hooks
if hookmetamethod then
    local Remotes = ReplicatedStorage:FindFirstChild("Remotes")
    local Data = Remotes and Remotes:FindFirstChild("Data")
    local Rep = Remotes and Remotes:FindFirstChild("Replication")
    local Fighter = Rep and Rep:FindFirstChild("Fighter")

    local Equip = Data and Data:FindFirstChild("EquipCosmetic")
    local Favorite = Data and Data:FindFirstChild("FavoriteCosmetic")
    local UseItem = Fighter and Fighter:FindFirstChild("UseItem")

    local old
    old = hookmetamethod(game, "__namecall", function(self, ...)
        if not old then return end
        if getnamecallmethod() ~= "FireServer" then
            return old(self, ...)
        end

        local args = {...}

        if self == UseItem and FighterController then
            pcall(function()
                local f = FighterController:GetFighter(player)
                for _, item in pairs(f.Items or {}) do
                    if item:Get("ObjectID") == args[1] then
                        lastUsedWeapon = item.Name
                        break
                    end
                end
            end)
        end

        if self == Equip then
            local weapon, cType, cName, opts = args[1], args[2], args[3], args[4] or {}
            equipped[weapon] = equipped[weapon] or {}

            if not cName or cName == "None" then
                equipped[weapon][cType] = nil
            else
                equipped[weapon][cType] = cloneCosmetic(cName, cType, {
                    inverted = opts.IsInverted,
                    favoritesOnly = opts.OnlyUseFavorites
                })
            end

            task.defer(function()
                pcall(function()
                    DataController.CurrentData:Replicate("WeaponInventory")
                end)
                saveConfig()
            end)

            return
        end

        if self == Favorite then
            favorites[args[1]] = favorites[args[1]] or {}
            favorites[args[1]][args[2]] = args[3]
            saveConfig()
            return
        end

        return old(self, ...)
    end)
end

--// ViewModel images (fixed)
local originalGetImage = ItemLibrary.GetViewModelImageFromWeaponData
ItemLibrary.GetViewModelImageFromWeaponData = function(self, weaponData, highRes)
    if not weaponData or not weaponData.Name then
        return originalGetImage(self, weaponData, highRes)
    end

    local w = weaponData.Name
    local skin = equipped[w] and equipped[w].Skin
    if skin then
        local info = self.ViewModels[skin.Name]
        if info then
            return info[highRes and "ImageHighResolution" or "Image"] or info.Image
        end
    end

    return originalGetImage(self, weaponData, highRes)
end

--// Profile viewer
pcall(function()
    local VP = require(PlayerScripts.Modules.Pages.ViewProfile)
    local old = VP.Fetch
    VP.Fetch = function(self, target)
        viewingProfile = target
        return old(self, target)
    end
end)

--// Init
loadConfig()

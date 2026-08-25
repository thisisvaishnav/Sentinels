Cross-cutting facts (verified by exhaustive grep over app/, src/, constants/, hooks/)

┌───────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                 Question                  │                                              Answer                                              │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ expo-haptics used?                        │ No — zero usages anywhere. Dep expo-haptics: ~15.0.8 is installed but never imported.            │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ expo-symbols / SF Symbols?                │ No usages. Dep expo-symbols: ~1.0.8 installed, never imported. No IconSymbol/SymbolView. All     │
│                                           │ icons = @expo/vector-icons Ionicons + MaterialCommunityIcons.                                    │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Reanimated?                               │ Only a side-effect import: app/_layout.tsx:7 import 'react-native-reanimated';. No               │
│                                           │ useSharedValue/withTiming/useAnimatedStyle anywhere in the app.                                  │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Animated API?                             │ Zero in the CITIZEN section. Only src/components/admin/AdminDrawer.tsx:34-62 (admin drawer,      │
│                                           │ Animated.spring/Animated.timing, useNativeDriver: true). No JS-driven loops anywhere.            │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ FlatList / SectionList?                   │ Zero occurrences in the entire app/ and src/ tree. Every list is .map() or hardcoded sibling JSX │
│                                           │  inside ScrollView/View.                                                                         │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Memoization?                              │ Zero React.memo / useMemo / useCallback in app/(citizen) or app/(auth).                          │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Android ripple?                           │ Zero android_ripple, zero TouchableNativeFeedback, zero pressed-state style callbacks.           │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Switch?                                   │ Zero. Boolean toggles are hand-rolled 17×17 square checkboxes.                                   │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Shadows/elevation in citizen?             │ None at all in app/(citizen)/* or app/(auth)/*. The only elevation in the whole flow is          │
│                                           │ src/screens/RoleSelectionScreen.tsx:232-236.                                                     │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Border radius in citizen?                 │ borderRadius: 0 on all 17 style rules (deliberate square/brutalist look).                        │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ a11y props?                               │ Zero accessibilityRole, accessibilityLabel, accessibilityState, hitSlop, testID in               │
│                                           │ citizen/auth/screens.                                                                            │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Pull-to-refresh?                          │ None (RefreshControl absent).                                                                    │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Swipe actions / segmented controls /      │ None (Swipeable, SegmentedControl, BottomSheet all absent).                                      │
│ bottom-sheet libs?                        │                                                                                                  │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ GestureHandlerRootView?                   │ Absent everywhere, despite react-native-gesture-handler ~2.28.0 being a dep.                     │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                           │ constants/colors.ts (AppColors, AppRadius {sm:8, md:10, lg:12, xl:16, pill:9999}) — used only by │
│ Design system in use                      │  (auth) and RoleSelectionScreen. The 6 citizen screens use zero tokens; every colour is a        │
│                                           │ hardcoded hex, and three different "primary" darks coexist: #0F172A, #1E293B, #172A3A.           │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                           │ Fully written and completely unused — zero importers. getSchemes, getApplications,               │
│ src/services/citizenService.ts            │ getSupportTickets, createSupportTicket, applyForScheme, getDashboardSummary are all dead.        │
│                                           │ Citizen screens instead do raw fetch inline (dashboard) or show hardcoded strings                │
│                                           │ (progress/schemes/support).                                                                      │
├───────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ src/features/auth/citizenNavigation.ts    │ Also zero importers — routeCitizenAfterAuth() is dead; login/register navigate with hardcoded    │
│                                           │ router.replace("/(citizen)/dashboard").                                                          │
└───────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────┘

The single most consequential cross-cutting defect: marginTop: -30 on the root SafeAreaView of every screen (commit 805e6f9 "Updated all 14 screens to marginTop: -30"), which cancels the safe-area top inset by brute force:

- app/(citizen)/dashboard.tsx:302, app/(citizen)/household.tsx:1271, app/(citizen)/progress.tsx:41, app/(citizen)/schemes.tsx:41, app/(citizen)/support.tsx:41, app/(auth)/login.tsx:367, app/(auth)/register.tsx:289, src/screens/RoleSelectionScreen.tsx:179 (also (enumerator)/dashboard.tsx:112, (admin)/login.tsx:187, src/components/admin/AdminLayout.tsx:28).

This directly fights "edgeToEdgeEnabled": true in app.json:23 — content is pulled up under the status bar by 30px on every citizen screen.

---

app/(citizen)/_layout.tsx (56 lines)

Pure expo-router Tabs, no custom tab bar, no header.

// app/(citizen)/_layout.tsx:6-16
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#D1D5DB',
        },
        tabBarActiveTintColor: '#0F172A',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >

// app/(citizen)/_layout.tsx:17-25
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

Four tabs: dashboard (home-outline, L22), progress (stats-chart-outline, L31), schemes (newspaper-outline, L40), support (help-circle-outline, L49). household is hidden: <Tabs.Screen name="household" options={{ href: null }} /> (L53).

M3-relevant gaps: -outline glyph used for both active and inactive (M3 wants filled-when-active); no tabBarLabelStyle, no explicit height/padding, no tabBarActiveBackgroundColor or M3 pill/indicator, no bottom-inset handling, borderTopColor hairline instead of an M3 surface-container tint, no ripple (@react-navigation/bottom-tabs v7 default on Android is PlatformPressable, so there is some default ripple here — this is the only place in the citizen flow with any).

---

app/(citizen)/dashboard.tsx (497 lines)

1. UI patterns. SafeAreaView (from react-native-safe-area-context) → custom View header → ScrollView. Buttons: TouchableOpacity ×3 (no Pressable). Cards: bordered Views. Lists: hardcoded sibling components, no FlatList. No TextInput, no Switch, no Modal. One badge.

Header (view-based, not a navigator header):
// app/(citizen)/dashboard.tsx:126-134
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brand}>Hello, Citizen</Text>
          <Text style={styles.headerSub}>Welcome to your central civic hub.</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#111111" />
        </TouchableOpacity>
      </View>
Note signOutBtn: { padding: 6 } (L325-327) around a 20px icon → ~32dp touch target, below the 48dp M3 minimum, and no ripple.

Badge (status chip):
// app/(citizen)/dashboard.tsx:155-162
            <View style={[styles.badge, householdProfile && styles.badgeVerified]}>
              <Ionicons
                name={householdProfile ? "checkmark-circle" : "time-outline"}
                size={12}
                color="#FFFFFF"
              />
              <Text style={styles.badgeText}>{householdStatus}</Text>
            </View>

Primary CTA button render:
// app/(citizen)/dashboard.tsx:188-196
          <TouchableOpacity
            style={styles.householdButton}
            activeOpacity={0.8}
            onPress={() => router.push("/(citizen)/household")}
          >
            <Text style={styles.householdButtonText}>
              {householdProfile ? "View Details" : "Register Now"}
            </Text>
          </TouchableOpacity>

Grid card component:
// app/(citizen)/dashboard.tsx:265-272
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardIcon}>
        <Ionicons name={icon} size={22} color="#1E293B" />
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
    </TouchableOpacity>
Two of the six ActionCards have no onPress at all — "Was I Counted?" (L206-209) and "Report Missing Household" (L210-213) render as dead but visually identical tappables.

List item render (activity row — a View, not tappable):
// app/(citizen)/dashboard.tsx:284-295
    <View style={styles.activityItem}>
      <View style={styles.activityIconWrap}>
        <Ionicons name="checkmark-circle-outline" size={18} color="#1E293B" />
      </View>
      <View style={styles.activityCopy}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityText}>{text}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </View>

2. iOS-looking patterns. None specifically Cupertino here — no SF Symbols, no segmented control, no swipe actions. The problem is the opposite: it's platform-neutral flat/brutalist (0 radius, 0 elevation, hairline borders) rather than M3.

3. Touch feedback. TouchableOpacity only, with activeOpacity={0.8} (L190) and activeOpacity={0.7} (L266); the sign-out button (L131) has no activeOpacity → default 0.2 fade. No ripple anywhere.

4. Animations. None.

5. Haptics. None.

6. Dynamic numbers (tabular-nums candidates):
// app/(citizen)/dashboard.tsx:148-150
                <Text style={styles.householdId}>
                  {householdProfile.head_full_name} · {householdProfile.total_members} members
                </Text>
// app/(citizen)/dashboard.tsx:175-178
                <Text style={styles.summaryText}>
                  {householdProfile.male_members} Male · {householdProfile.female_members} Female · {householdProfile.children_count} Children
                </Text>
// app/(citizen)/dashboard.tsx:169-171
                <Text style={styles.summaryText}>
                  {householdProfile.house_no}, {householdProfile.locality}, {householdProfile.ward}
                </Text>
// app/(citizen)/dashboard.tsx:181-183
                <Text style={styles.summaryText}>
                  {householdProfile.head_mobile_number}
                </Text>
Timestamps and one count are hardcoded: time="Oct 12, 2023 · 14:30" (L236), "Oct 08, 2023 · 10:12" (L241), "Oct 04, 2023 · 17:42" (L246), and "You have 2 new welfare scheme recommendations based on your profile." (L245).

7. Radii / shadows / elevation. Every one is borderRadius: 0 — L336 (householdPanel), L348 (householdIconBox 42×42), L389 (badge), L407 (householdButton), L432 (card), L441 (cardIcon 46×46), L456 (activityList), L469 (activityIconWrap 30×30). No shadowColor/elevation anywhere. Borders: borderWidth: 1, borderColor: "#D1D5DB"; dividers #E5E7EB.

Type scale is unusually large and unsystematic: brand: fontSize: 40, fontWeight: "700" (L316-320), householdPanelTitle: fontSize: 30 (L356-360), sectionTitle: fontSize: 22 (L415-419), headerSub: 15, badgeText: 11, householdId: 11.

8. Loading state. Full-screen spinner swap, no skeleton:
// app/(citizen)/dashboard.tsx:116-122
  if (checkingStatus) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0F172A" />
      </SafeAreaView>
    );
  }
Note: setCheckingStatus(false) is only reached on the success path (L104) — on a thrown error it redirects, and the household-profile fetch failure (L98-100) leaves the panel in the "No profile registered" state.

9. Safe area / StatusBar. SafeAreaView from react-native-safe-area-context with no edges prop (L125), and container has marginTop: -30 (L302). No useSafeAreaInsets, no local StatusBar.

10. Long lists / memo. ScrollView + hardcoded children; ActionCard/ActivityItem are plain function components, not memoized.

---

app/(citizen)/household.tsx (1564 lines) — the big one

Three exclusive render branches from one nested ternary (L656-1260): loading spinner → read-only profile view → registration form.

1. UI patterns. SafeAreaView → KeyboardAvoidingView → custom 56dp header View → ScrollView → bordered "card" sections. Form: react-hook-form + zod (zodResolver, L396) with 20 fields via <Controller>. Text inputs: custom InputField wrapper (L189-219). Toggles: custom FacilityCheckbox (L241-272). Picker: custom GenderPicker + Modal (L284-371). No Switch, no FlatList, no badges.

Header render (both branches):
// app/(citizen)/household.tsx:665-689  (profile branch)
        <View style={styles.header}>
          <Pressable
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color="#172A3A"
            />
          </Pressable>

          <Text style={styles.headerTitle}>My Household Profile</Text>

          <Pressable
            style={styles.headerButton}
            onPress={() => router.replace("/(citizen)/dashboard")}
          >
            <Ionicons
              name="home-outline"
              size={22}
              color="#172A3A"
            />
          </Pressable>
        </View>
// app/(citizen)/household.tsx:780-803  (form branch)
        <View style={styles.header}>
          <Pressable
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="menu-outline"
              size={27}
              color="#172A3A"
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Register My Household
          </Text>

          <Pressable style={styles.headerButton}>
            <Ionicons
              name="refresh-outline"
              size={23}
              color="#172A3A"
            />
          </Pressable>
        </View>
Note the form-branch trailing Pressable (L796) has no onPress, and the leading icon is a hamburger (menu-outline) that actually performs router.back() — wrong affordance. Header style: height: 56 (L1286), backgroundColor: "#F8FAFB" (L1287), 1px bottom border #D8DDE2, headerTitle: fontSize: 14, fontWeight: "700" (L1303-1307) — M3 top app bar wants a 22-24sp title. headerButton: {width: 38, height: 38} (L1296-1301) → 38dp, below 48dp, and no ripple.

Text input render:
// app/(citizen)/household.tsx:198-218
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8A929D"
        keyboardType={keyboardType}
        editable={editable}
        style={[
          styles.input,
          !editable && styles.disabledInput,
          error && styles.inputError,
        ]}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
Styles: input: {height: 44, borderWidth: 1.5, borderColor: "#AEB5BE", paddingHorizontal: 11, fontSize: 15} (L1355-1363), label: {fontSize: 11, fontWeight: "500", letterSpacing: 0.3} (L1347-1353, all-caps callers e.g. "FULL NAME" L826), errorText: {fontSize: 10, color: "#C62828"} (L1374-1378), inputError.borderColor: "#C62828" (L1370-1372). No radius, no filled container, no floating label, no selectionColor/cursorColor. M3 outlined field is 56dp tall with 4dp corners.

Checkbox render (the closest thing to a switch):
// app/(citizen)/household.tsx:247-271
    <Pressable
      style={styles.facilityRow}
      onPress={() => onChange(!value)}
    >
      <View style={[styles.checkbox, value && styles.checkboxActive]}>
        {value && (
          <Ionicons
            name="checkmark"
            size={16}
            color="#FFFFFF"
          />
        )}
      </View>

      <Ionicons
        name={icon}
        size={23}
        color="#747C87"
        style={styles.facilityIcon}
      />

      <Text style={styles.facilityText}>{label}</Text>
    </Pressable>
checkbox: {width: 17, height: 17, borderWidth: 1.5, borderColor: "#9BA3AD", marginRight: 14} (L1395-1403), active fill #172A3A (L1405-1408), facilityRow: {minHeight: 48} (L1410-1414). Five instances (L1084-1147). No ripple, no pressed state, no accessibilityRole="checkbox".

Modal / bottom-sheet:
// app/(citizen)/household.tsx:331-368
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.genderModal}>
            <Text style={styles.modalTitle}>Select Gender</Text>

            {genders.map((gender) => (
              <Pressable
                key={gender}
                style={styles.genderOption}
                onPress={() => {
                  onChange(gender);
                  setVisible(false);
                }}
              >
                <Text style={styles.genderOptionText}>
                  {gender}
                </Text>

                {value === gender && (
                  <Ionicons
                    name="checkmark"
                    size={22}
                    color="#172A3A"
                  />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
This is the iOS-flavoured piece: an action-sheet-style sheet docked to the bottom (modalOverlay: {backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end"}, L1511-1515) with a trailing checkmark for the selected row — but with borderTopLeftRadius: 0, borderTopRightRadius: 0 (L1519-1520) and animationType="fade" instead of "slide", and paddingBottom: 35 hardcoded instead of using the bottom inset (L1522). genderOption: {height: 52, borderBottomWidth: 1, borderBottomColor: "#E5E8EB"} (L1532-1539). M3 equivalents: 28dp top corners, drag handle, 24dp leading padding, radio-button list, ripple. The overlay Pressable wraps the sheet directly, so taps on the sheet's own padding also dismiss it (no stopPropagation, unlike the version in App.tsx:756-758).

The picker trigger is a Pressable styled as a text field:
// app/(citizen)/household.tsx:302-324
        <Pressable
          style={[
            styles.input,
            styles.selectInput,
            error && styles.inputError,
          ]}
          onPress={() => setVisible(true)}
        >
          <Text
            style={[
              styles.selectText,
              !value && styles.placeholderText,
            ]}
          >
            {value || "Select..."}
          </Text>

          <Ionicons
            name="chevron-down"
            size={20}
            color="#66717D"
          />
        </Pressable>

Secondary "location" button:
// app/(citizen)/household.tsx:1171-1200
              <Pressable
                style={[
                  styles.locationButton,
                  location && styles.locationButtonSuccess,
                ]}
                onPress={captureLocation}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator color="#172A3A" />
                ) : (
                  <>
                    <Ionicons
                      name={
                        location
                          ? "checkmark-circle-outline"
                          : "locate-outline"
                      }
                      size={22}
                      color="#172A3A"
                    />

                    <Text style={styles.locationButtonText}>
                      {location
                        ? "LOCATION CAPTURED"
                        : "USE MY LOCATION"}
                    </Text>
                  </>
                )}
              </Pressable>
locationButton: {width: "100%", height: 46, backgroundColor: "#57B4F4", borderRadius: 0} (L1443-1452), success #8BD6A5 (L1454-1456), text fontSize: 12, fontWeight: "700", letterSpacing: 0.2 (L1458-1463). Those two blues/greens are off-palette (not in AppColors).

Pinned submit button (the M3 "bottom action bar" candidate):
// app/(citizen)/household.tsx:1231-1256
        <View style={styles.submitContainer}>
          <Pressable
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.submitText}>
                  SUBMIT HOUSEHOLD
                </Text>

                <Ionicons
                  name="cloud-upload-outline"
                  size={21}
                  color="#FFFFFF"
                />
              </>
            )}
          </Pressable>
        </View>
// app/(citizen)/household.tsx:1480-1503
  submitContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 8 : 8,
    backgroundColor: "#F1F4F6",
  },

  submitButton: {
    height: 48,
    backgroundColor: "#172A3A",
    borderRadius: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  submitButtonDisabled: {
    opacity: 0.7,
  },
paddingBottom: Platform.OS === "ios" ? 8 : 8 is a no-op ternary (identical branches, L1487) — no bottom safe-area inset, so under edgeToEdgeEnabled: true this bar sits under the Android gesture/nav bar. Scroll spacer is a magic <View style={{ height: 110 }} /> (L1224).

Keyboard handling:
// app/(citizen)/household.tsx:773-778
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios" ? "padding" : undefined
        }
      >
behavior={undefined} on Android + ScrollView with keyboardShouldPersistTaps="handled" (L810). No keyboardDismissMode.

2. iOS-looking patterns. The bottom-docked action sheet with trailing checkmarks (above) is the main one; also Platform.OS === "ios" ? "padding" guards. No SF Symbols, no swipe actions, no segmented control.

3. Touch feedback. 10 Pressables, 0 TouchableOpacity, and not a single one supplies a pressed style or android_ripple — bare <Pressable style={styles.x}> means zero visual feedback on press for the header buttons, gender trigger, all 3 sheet options, the 5 facility rows, the location button and the submit button. This is the highest-impact M3 fix in the file.

4. Animations. None. Only Modal animationType="fade".

5. Haptics. None — notably absent on GPS capture success (L531), submit success (L626) and validation failure.

6. Dynamic numbers (tabular-nums candidates — several are live-updating decimals):
// app/(citizen)/household.tsx:766-767
            <ProfileRow label="Latitude" value={existingProfile.latitude.toFixed(6)} />
            <ProfileRow label="Longitude" value={existingProfile.longitude.toFixed(6)} />
// app/(citizen)/household.tsx:1202-1219
              {location && (
                <View style={styles.coordinates}>
                  <Text style={styles.coordinateText}>
                    Lat: {location.latitude.toFixed(6)}
                  </Text>

                  <Text style={styles.coordinateText}>
                    Long: {location.longitude.toFixed(6)}
                  </Text>

                  {location.accuracy !== null && (
                    <Text style={styles.coordinateText}>
                      Accuracy: ±
                      {location.accuracy.toFixed(1)}m
                    </Text>
                  )}
                </View>
              )}
// app/(citizen)/household.tsx:709-728
            <ProfileRow
              label="Total Members"
              value={String(existingProfile.total_members)}
            />
            <ProfileRow
              label="Male Members"
              value={String(existingProfile.male_members)}
            />
            <ProfileRow
              label="Female Members"
              value={String(existingProfile.female_members)}
            />
            <ProfileRow
              label="Children (<18)"
              value={String(existingProfile.children_count)}
            />
            <ProfileRow
              label="Seniors (65+)"
              value={String(existingProfile.senior_count)}
            />
Plus String(existingProfile.head_age) (L699), head_mobile_number (L703), pincode (L737). coordinateText: {textAlign: "center", fontSize: 11} (L1473-1478) — centred 6-dp decimals with proportional digits is exactly where fontVariant: ['tabular-nums'] matters.

7. Radii / shadows / elevation. card: {borderWidth: 1, borderColor: "#D0D5DB", borderRadius: 0, padding: 14, marginBottom: 14} (L1317-1324). borderRadius: 0 also at L1451, L1470, L1494; borderTopLeftRadius/RightRadius: 0 at L1519-1520. No shadow/elevation at all. Page bg #F1F4F6, card #FFFFFF, header #F8FAFB, locationBox #EEF0F2 (L1426-1432).

8. Loading states. Three separate ActivityIndicators, no skeletons: full-screen size="large" color="#172A3A" (L660), inline in the location button (L1180), inline in the submit button (L1241). submitButtonDisabled: {opacity: 0.7} (L1501-1503).

9. Safe area / StatusBar. SafeAreaView from safe-area-context at L658, L664, L772 — no edges prop on any, safeArea: {marginTop: -30} (L1271). No useSafeAreaInsets, no StatusBar.

10. Long list / memo. The profile branch renders ~24 ProfileRows as plain Views in a ScrollView; the form branch renders 20 Controller-wrapped fields. No FlatList, no memoization. profileRow: {paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#E5E8EB", gap: 4} (L1546-1551).

Also relevant for M3: 7 Alert.alert calls (L511, 531, 538, 554, 568, 626, 641) used for permission prompts, success confirmations and error reporting — M3 would route the transient ones (location captured, submission failed) to a Snackbar.

---

app/(citizen)/progress.tsx, schemes.tsx, support.tsx (84 / 84 / 84 lines)

These three are byte-for-byte structural clones — identical container/header/headerLeft/brand/headerSub/card/row style blocks (same line numbers 35-73 in each), differing only in copy, icon and the two text style names.

1. UI patterns. SafeAreaView (with the padding directly on it, no ScrollView at all) → view-based header → two static bordered cards. Zero interactive elements — no TouchableOpacity, no Pressable, no inputs, no switches, no modals, no badges, no lists. Nothing is fetched; all content is hardcoded, even though citizenService.ts has ready-made getSchemes() / getSupportTickets() / getApplications().

Representative card render (all six are this shape):
// app/(citizen)/progress.tsx:16-30
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="time-outline" size={18} color="#0C79B4" />
          <Text style={styles.cardTitle}>Pending Request</Text>
        </View>
        <Text style={styles.cardValue}>1 Active</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="checkmark-circle-outline" size={18} color="#10B981" />
          <Text style={styles.cardTitle}>Completed Services</Text>
        </View>
        <Text style={styles.cardValue}>2 Closed</Text>
      </View>
// app/(citizen)/schemes.tsx:16-22
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="leaf-outline" size={18} color="#10B981" />
          <Text style={styles.schemeName}>Household Assistance</Text>
        </View>
        <Text style={styles.schemeDesc}>Support for basic household development and utilities.</Text>
      </View>
// app/(citizen)/support.tsx:24-30
      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="chatbox-ellipses-outline" size={18} color="#D97706" />
          <Text style={styles.itemTitle}>Raise a Ticket</Text>
        </View>
        <Text style={styles.itemText}>Submit details and track support resolution from Progress.</Text>
      </View>
Header (identical in all three, only the string changes):
// app/(citizen)/schemes.tsx:9-14
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brand}>Schemes</Text>
          <Text style={styles.headerSub}>View available schemes and benefits.</Text>
        </View>
      </View>

2. iOS patterns. None. 3. Touch feedback. N/A — nothing is tappable, including "Raise a Ticket" and "Helpline" which read as actions but aren't. 4. Animations. None. 5. Haptics. None.

6. Dynamic numbers. None are dynamic — but the two on progress are the intended stat slots: <Text style={styles.cardValue}>1 Active</Text> (progress.tsx:21) and <Text style={styles.cardValue}>2 Closed</Text> (progress.tsx:29), style cardValue: {fontSize: 18, fontWeight: '700'} (L79-83). citizenService.ts:61-64 already defines the real source: stats: { appliedSchemesCount: number; activeTicketsCount: number }.

7. Radii / shadows. card: {borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 0, padding: 16, gap: 8} at L61-68 in each file. No shadow/elevation.

8. Loading states. None (nothing async).

9. Safe area. SafeAreaView with no edges; container: {flex: 1, backgroundColor: '#FFFFFF', padding: 20, gap: 14, marginTop: -30} (L36-42 in each). No StatusBar. Because there's no ScrollView, content will clip rather than scroll on small screens / large font scale.

10. Lists. No lists.

Shared type scale: brand: {fontSize: 40, fontWeight: '700', color: '#1E293B'}, headerSub: {fontSize: 15, color: '#4B5563'} — matching the dashboard's oversized 40px display heading.

---

app/(auth)/_layout.tsx (10 lines)

// app/(auth)/_layout.tsx:4-9
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
    </Stack>
  );
No animation, no contentStyle, no M3 shared-axis transition config — inherits platform default (react-native-screens slide from right on Android).

app/(auth)/login.tsx (546 lines)

Uses AppColors/AppRadius tokens (L17). SafeAreaView → KeyboardAvoidingView (behavior={Platform.OS === "ios" ? "padding" : undefined}, L104) → ScrollView → a single bordered "card" container. 5 TouchableOpacity, 0 Pressable. Role-switching screen (citizen | enumerator) driven by useLocalSearchParams.

Back affordance (Cupertino-ish "‹ Back" text button rather than an M3 top app bar with a 48dp icon button):
// app/(auth)/login.tsx:113-123
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color={AppColors.primary}
                />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
Primary button:
// app/(auth)/login.tsx:214-229
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? "Checking..." : isEnumerator ? "Authenticate" : "Sign In"}
              </Text>

              <Ionicons
                name="arrow-forward"
                size={24}
                color={AppColors.textWhite}
              />
            </TouchableOpacity>
primaryButton: {height: 58, backgroundColor: AppColors.primary, gap: 15, marginTop: 8} (L462-470) — no borderRadius at all, so square; disabled = opacity: 0.65 (L472-474). Loading is a text swap ("Checking…"), no ActivityIndicator — the only loading affordance in the auth flow.

Input:
// app/(auth)/login.tsx:296-308
      <View style={styles.inputContainer}>
        {icon}

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={AppColors.textMuted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
      </View>
inputContainer: {height: 56, borderWidth: 1.5, borderColor: AppColors.borderInput, backgroundColor: AppColors.bgInput, paddingHorizontal: 14} (L445-453) — 56dp is already M3-height, just needs radii/focus states. label: {fontSize: 16, letterSpacing: 1.5, fontWeight: "600"} (L437-443) with all-caps callers. Password reveal is an un-padded TouchableOpacity around a 24px icon (L343-349) → ~24dp target.

Radii/shadow: only container.borderRadius: AppRadius.lg (=12, L386) and logo.borderRadius: AppRadius.xl (=16, L412). No elevation. safeArea.marginTop: -30 (L367). Type: brand: 34/700 letterSpacing -0.8 (L419-424), subtitle: 19 (L426-431). Errors use the web alert() global (L38, L55, L70, L81), not Alert.alert — on RN this renders as an unstyled blocking dialog. No haptics, no animations, no StatusBar.

app/(auth)/register.tsx (454 lines)

Same shell as login (SafeAreaView → KeyboardAvoidingView → ScrollView → bordered container), tokens from AppColors/AppRadius. 6 TouchableOpacity, 0 Pressable.

The state picker is an inline expanding dropdown (not a Modal) — the one list built with .map():
// app/(auth)/register.tsx:169-204
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.inputContainer}
                onPress={() => setShowStates(!showStates)}
              >
                <Text
                  style={[
                    styles.dropdownValue,
                    !state ? styles.placeholder : null,
                  ]}
                >
                  {state || "Select State"}
                </Text>
                <Ionicons
                  name={showStates ? "chevron-up" : "chevron-down"}
                  size={21}
                  color={AppColors.textMuted}
                />
              </TouchableOpacity>
              {showStates && (
                <View style={styles.dropdown}>
                  {STATES.map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setState(item);
                        setShowStates(false);
                      }}
                    >
                      <Text style={styles.dropdownText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
dropdown: {borderWidth: 1, marginTop: -12, marginBottom: 20} (L402-408) — negative margin to abut the trigger; no elevation, no radius, appears/disappears with no animation (M3 would use an elevated menu with elevation level 2 + fade-scale). dropdownItem: {paddingHorizontal: 16, paddingVertical: 14} (L410-415) → ~46dp rows.

Primary button:
// app/(auth)/register.tsx:219-232
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.primaryButton,
                isSubmitting && { opacity: 0.65 },
              ]}
              onPress={handleRegister}
              disabled={isSubmitting}
            >
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? "Please wait..." : "CREATE ACCOUNT"}
              </Text>
              <Ionicons name="arrow-forward" size={24} color={AppColors.textWhite}
            </TouchableOpacity>
primaryButton: {height: 58, gap: 14, marginTop: 5} (L422-430) — again no radius; inline {opacity: 0.65} object created per render. Title scale: title: {fontSize: 36, fontWeight: "700"} (L347-352), brand: 25 (L340-345), subtitle: 18/27 (L354-360). safeArea.marginTop: -30 (L289). Validation via alert() (L45, L50, L68). No ActivityIndicator, no haptics, no animations, no StatusBar, no shadows, no radii except container/logo.

---

src/features/auth/citizenNavigation.ts (12 lines) — dead code

// src/features/auth/citizenNavigation.ts:4-12
export async function routeCitizenAfterAuth() {
  const household = await getCitizenHouseholdStatus();

  if (household.completed) {
    router.replace('/(citizen)/dashboard');
  } else {
    router.replace('/(citizen)/household');
  }
}
Zero importers. The same branch is instead duplicated inline in app/(citizen)/dashboard.tsx:72-77 (the guard that bounces to /(citizen)/household), while login.tsx:52 and register.tsx:65 hardcode router.replace("/(citizen)/dashboard").

src/services/citizenService.ts (190 lines) — what data should be on screen (also dead code)

Exports (all with Authorization: Bearer <citizen_token> from SecureStore, base EXPO_PUBLIC_API_URL || http://localhost:5001):
- getSchemes(category?) → Scheme[] — { id, title, description, details, eligibility_criteria, benefit_amount: string|null, category, status: 'Active'|'Closing Soon'|'Closed', created_at } (L8-18). The category param + 'All' sentinel (L110) implies a filter-chip row on the Schemes tab, and status implies status chips.
- applyForScheme(schemeId) (L122), getApplications() → SchemeApplication[] with status: 'Applied'|'Under Verification'|'Approved'|'Rejected' (L20-32) — a 4-state progress/stepper for the Progress tab.
- getSupportTickets() / createSupportTicket() → SupportTicket with priority: 'Low'|'Medium'|'High', status: 'Open'|'In Progress'|'Resolved'|'Closed' (L34-42).
- getDashboardSummary() → { household, recentActivities: Array<{id,type,title,description,date,status}>, stats: { appliedSchemesCount, activeTicketsCount } } (L44-65).

So the real dynamic-number surface once wired: appliedSchemesCount, activeTicketsCount, benefit_amount (currency), plus recentActivities[].date. Currently the dashboard bypasses this entirely with a raw inline fetch to /api/household/me (dashboard.tsx:84-93) and hardcoded activity rows.

---

Root / config

App.tsx (1120 lines) — dead code, not the entry point

package.json:3 is "main": "expo-router/entry", and nothing imports App.tsx (verified). It's a legacy monolith exporting App, RoleSelectionScreen (L138), SignupScreen (L200), LoginScreen (L534), InputLabel (L720), SelectionModal (L732).

Answers to your specific questions: no providers whatsoever — no SafeAreaProvider, no ThemeProvider, no GestureHandlerRootView, no QueryClientProvider (despite @tanstack/react-query being a dep), no edge-to-edge handling. It imports RN core SafeAreaView (App.tsx:3), which is iOS-only for insets. Its only status-bar setup:

// App.tsx:42-47
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7F9FB"
      />
backgroundColor on RN's StatusBar is a no-op/deprecated under Android 15 edge-to-edge. Notably this file does have M3-ish elevation the live screens lack (borderRadius: 15 L840, shadowOpacity: 0.08/shadowRadius: 3/elevation: 2 L845-852, borderRadius: 16 L857, borderRadius: 8 L927, borderRadius: 17 L943, borderTopLeftRadius: 20 L1088) and a properly-behaved sheet (animationType="slide", L749, with onPress={(e) => e.stopPropagation()} on the inner container, L757).

app/_layout.tsx (68 lines) — the real root

// app/_layout.tsx:52-67
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(citizen)" options={{ headerShown: false }} />
          <Stack.Screen name="(enumerator)" options={{ headerShown: false }} />
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
- Provider chain: SafeAreaProvider → react-navigation ThemeProvider (DefaultTheme/DarkTheme from useColorScheme, which is just export { useColorScheme } from 'react-native' in hooks/use-color-scheme.ts) → Stack. No GestureHandlerRootView. import 'react-native-reanimated' at L7 (side effect only).
- <Stack> has no screenOptions — headerShown: false is repeated per screen instead, and there's no animation/contentStyle, so no shared M3 transition and no root background colour.
- StatusBar style="auto" (L64) with no backgroundColor/translucent and no expo-navigation-bar / expo-system-ui call anywhere (verified: zero SystemUI/NavigationBar/setBackgroundColorAsync usages). Combined with hardcoded-light screens, dark mode yields dark status-bar icons on white content plus a DarkTheme navigation background — inconsistent.
- Stale template leftovers: unstable_settings = { anchor: '(tabs)' } (L11-13) and <Stack.Screen name="(tabs)" …> (L58) reference a app/(tabs) group that does not exist (only (admin), (auth), (citizen), (enumerator)).
- Gating logic returns null while hasOnboarded === null (L48-50) → blank frame instead of a splash/skeleton on cold start.

app/modal.tsx (34 lines) — unused template screen

Plain View (not SafeAreaView), centred Text + Link href="/" dismissTo. Styles: title: {fontSize: 24, fontWeight: '700'} (L26-29), linkText: {fontSize: 16, color: '#0a7ea4'} (L30-33) — #0a7ea4 is the Expo template teal, off-palette. Registered with presentation: 'modal', title: 'Modal' in the root Stack (L62) but not reachable from any citizen route.

app/onboarding.tsx (29 lines)

Thin wrapper that sets hasOnboarded then routes by role, rendering RoleSelectionScreen:
// app/onboarding.tsx:19-28
    if (role === 'citizen') {
      router.push({ pathname: '/(auth)/register', params: { role } });
    } else if (role === 'admin') {
      router.push('/(admin)/login');
    } else {
      router.push({ pathname: '/(auth)/login', params: { role } });
    }
  };

  return <RoleSelectionScreen onSelectRole={handleRoleSelect} />;
No onHelpPress passed → the "Need help?" button falls back to console.log (RoleSelectionScreen.tsx:161).

app.json

// app.json:9-11
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
// app.json:16-25
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false
    },
- edgeToEdgeEnabled: true ✅ but nothing in the code honours insets (no useSafeAreaInsets, no edges, plus the -30 margins and the absolutely-positioned submit bar).
- userInterfaceStyle: "automatic" while every citizen screen hardcodes light hex → dark mode is effectively broken/unhandled.
- No androidStatusBar block, no androidNavigationBar block, no expo-navigation-bar plugin, no expo-system-ui config.
- predictiveBackGestureEnabled: false — worth flipping for Android 14+ M3 polish, though it needs per-screen back handling review.
- Plugins (L32-53): expo-router, expo-splash-screen (imageWidth 200, bg #ffffff, dark #000000), expo-sqlite, expo-location. experiments: { typedRoutes: true, reactCompiler: true } (L55-58) — React Compiler is on, so hand-added useMemo/React.memo may be redundant, but it also means StyleSheet/inline-object churn is less of a concern than usual.

src/screens/RoleSelectionScreen.tsx (347 lines)

SafeAreaView → ScrollView → header + 2 primary RoleCards + "or" divider + 1 CompactRoleCard + help text button. 4 TouchableOpacity, 0 Pressable. Uses AppColors/AppRadius.

// src/screens/RoleSelectionScreen.tsx:38-53
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.roleCard}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>{getIcon()}</View>

      <View style={styles.cardContent}>
        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleDescription}>{description}</Text>
      </View>

      <Ionicons name="chevron-forward" size={22} color={AppColors.textMuted} />
    </TouchableOpacity>
The trailing chevron-forward is the most Cupertino-looking element in the live app (iOS disclosure indicator on a list row).

The only shadow/elevation in the whole citizen-facing flow:
// src/screens/RoleSelectionScreen.tsx:222-237
  roleCard: {
    minHeight: 110,
    backgroundColor: AppColors.bgCard,
    borderWidth: 2,
    borderColor: AppColors.primary,
    borderRadius: AppRadius.xl,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
borderWidth: 2 + elevation: 4 together is non-M3 (M3 uses either an outline or elevation, not both). Other radii: iconContainer.borderRadius: AppRadius.xl (=16, L242), compactCard.borderRadius: AppRadius.lg (=12, L297), compactIconContainer.borderRadius: AppRadius.lg (L308). safeArea.marginTop: -30 (L179). Type: title: 38/44, fontWeight "800", letterSpacing -1.2 (L198-205), subtitle: 20/28 marginTop: 28 (L207-214). No numbers displayed, no loading state, no animation, no haptics, no StatusBar, no FlatList (only 3 fixed cards).

src/screens/SignupScreen.tsx (279 lines) — dead AND broken

// src/screens/SignupScreen.tsx:13-18
import {
  InputLabel,
  SelectionModal,
  authStyles,
  states,
} from '@/src/features/auth/shared';
src/features/auth/shared does not exist — that directory contains only .gitkeep, authService.ts, citizenNavigation.ts. And nothing imports SignupScreen (only RoleSelectionScreen is imported, by app/onboarding.tsx:4). So this file cannot compile if ever referenced; it's superseded by app/(auth)/register.tsx. For the record it uses 8 TouchableOpacity, 0 Pressable, two SelectionModal bottom sheets (L254-276), handleCreateAccount that just does router.replace("/(citizen)/dashboard") with no API call (L41-43), and hardcoded hex colours (#91A4B9, #7C8289, #BFC3C9, #707982) plus branding as "LokVision" (L64) rather than "Sentinels".

---

Highest-leverage M3 targets, ranked

1. Touch feedback — app/(citizen)/household.tsx has 10 bare Pressables with no ripple/pressed style (L666, 679, 781, 796, 302, 337, 345, 248, 1171, 1232); dashboard.tsx has 3 TouchableOpacity (L131, 188, 266). Nothing in the app uses android_ripple.
2. Edge-to-edge correctness — remove marginTop: -30 (dashboard:302, household:1271, progress:41, schemes:41, support:41), add edges/useSafeAreaInsets, fix household.tsx:1487's no-op ternary so the pinned submit bar respects the bottom inset, and add an explicit StatusBar/system-bar config (currently only app/_layout.tsx:64 style="auto").
3. Shape & elevation — 17 borderRadius: 0 rules across the 5 citizen screens and zero elevation; AppRadius tokens already exist but no citizen screen imports them.
4. Tab bar — _layout.tsx:6-16 needs M3 treatment (active-filled icons, label style, height + bottom inset, active indicator).
5. Top app bars — three hand-rolled headers (dashboard.tsx:126, household.tsx:665 and :780) with 32-38dp icon targets and a 14px title in household vs a 40px display title in the tab screens.
6. Text fields — household.tsx:1355 (44dp, square, all-caps external labels) vs login.tsx:445/register.tsx:374 (56dp, square).
7. Sheet/menu — household.tsx:331-368 (fade, square corners, dismisses on own padding) and register.tsx:188-203 (inline dropdown, no elevation/animation).
8. Haptics — zero usages; expo-haptics already installed. Obvious insertion points: household.tsx:531 (GPS captured), :626 (submit success), :641 (failure), facility checkbox :250, tab presses.
9. Numbers — no fontVariant: ['tabular-nums'] anywhere; needed at household.tsx:766-767, 1205, 1209, 1215 (live toFixed decimals), household.tsx:709-728, dashboard.tsx:149, 176-177, 182, progress.tsx:21, 29.
10. Wire up the dead data layer (citizenService.ts, citizenNavigation.ts) if the M3 pass is supposed to include real chips/lists/stat counts — otherwise progress/schemes/support stay static two-card placeholders with no lists to virtualize or memoize.

Exploration is complete — all files read, all cross-cutting greps done. Here are the results.

Answers to the coordinator's two questions up front

Design system status: there are three disconnected token files and the citizen screens use none of them. /Users/bombermac/test/Sentinels/constants/colors.ts defines AppColors (primary #172A3A, blue #0284C7, success #059669…) and AppRadius (sm:8, md:10, lg:12, xl:16, pill:9999). /Users/bombermac/test/Sentinels/constants/theme.ts is the untouched Expo-template Colors.light/dark + Fonts (iOS system-ui/ui-rounded values). constants/adminTheme.ts is admin-only. Every citizen screen hardcodes hex and hardcodes borderRadius: 0. Only /Users/bombermac/test/Sentinels/app/(auth)/login.tsx and register.tsx import AppColors/AppRadius.

Citizen audit headline: zero haptics, zero SF Symbols, zero Reanimated, zero FlatList, zero elevation/shadow, zero ripple, zero radii, zero accessibility props, and a marginTop: -30 inset-cancelling hack on every screen. It is a blank slate for M3 — nothing iOS-specific to strip except one bottom-sheet layout and the dead App.tsx.

---

Cross-cutting facts (verified by grep across app/ + src/)

┌────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│            Concern             │                                                   Finding                                                   │
├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ expo-haptics                   │ Installed (~15.0.8) but zero usages anywhere in app/ or src/.                                               │
├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ expo-symbols / SF Symbols      │ Installed (~1.0.8) but zero usages. No SymbolView, no IconSymbol. All icons are Ionicons /                  │
│                                │ MaterialCommunityIcons.                                                                                     │
├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Reanimated                     │ Only a side-effect import: /Users/bombermac/test/Sentinels/app/_layout.tsx:7 → import                       │
│                                │ 'react-native-reanimated';. No useSharedValue/withTiming/useAnimatedStyle anywhere.                         │
├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                │ Only in /Users/bombermac/test/Sentinels/src/components/admin/AdminDrawer.tsx (admin, out of scope) —        │
│ Animated API                   │ Animated.spring/Animated.timing with useNativeDriver: true. No animation of any kind in the citizen         │
│                                │ section.                                                                                                    │
├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ FlatList / SectionList         │ None in the entire repo (app/, src/, App.tsx). Every list is .map() or hardcoded JSX.                       │
├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Memoization                    │ No React.memo, useMemo, or useCallback in app/(citizen) or app/(auth).                                      │
├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Ripple                         │ No android_ripple, no TouchableNativeFeedback, no pressed-state style callbacks.                            │
├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Accessibility                  │ No accessibilityRole, accessibilityLabel, accessibilityState, hitSlop, or testID in citizen/auth/screens.   │
├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ <Switch>                       │ Not used anywhere — facility toggles are custom square checkboxes.                                          │
├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ GestureHandlerRootView         │ Never rendered, despite react-native-gesture-handler ~2.28.0 being installed.                               │
├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Swipe actions / segmented      │ None.                                                                                                       │
│ controls / BottomSheet lib     │                                                                                                             │
├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ RefreshControl /               │ None in citizen.                                                                                            │
│ pull-to-refresh                │                                                                                                             │
├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ marginTop: -30                 │ 11 files (commit 805e6f9 "Updated all 14 screens to marginTop: -30"). All 5 citizen files, both auth files, │
│                                │  RoleSelectionScreen, admin login, enumerator dashboard, AdminLayout.                                       │
├────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                │ /Users/bombermac/test/Sentinels/src/services/citizenService.ts is imported by nothing.                      │
│ Data wiring                    │ /Users/bombermac/test/Sentinels/src/features/auth/citizenNavigation.ts (routeCitizenAfterAuth) is imported  │
│                                │ by nothing.                                                                                                 │
└────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

---

1. /Users/bombermac/test/Sentinels/app/(citizen)/_layout.tsx (56 lines)

Expo Router Tabs, 4 visible tabs + 1 hidden.

// _layout.tsx:6-16
<Tabs
  screenOptions={{
    headerShown: false,
    tabBarStyle: {
      backgroundColor: '#FFFFFF',
      borderTopColor: '#D1D5DB',
    },
    tabBarActiveTintColor: '#0F172A',
    tabBarInactiveTintColor: '#6B7280',
  }}
>

// _layout.tsx:17-25  (icon render pattern, repeated 4x)
<Tabs.Screen
  name="dashboard"
  options={{
    title: 'Home',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="home-outline" color={color} size={size} />
    ),
  }}
/>

Icons: home-outline (20), stats-chart-outline (31), newspaper-outline (40), help-circle-outline (49). Household hidden: <Tabs.Screen name="household" options={{ href: null }} /> (line 53).

M3 gaps: -outline variant used for both active and inactive (M3 wants filled-when-active); no tabBarLabelStyle, no height/tabBarItemStyle, no active indicator pill, no tabBarButton override for ripple or haptics; borderTopColor hairline instead of M3 surface-container elevation; tint #0F172A is a one-off (not in AppColors).

---

2. /Users/bombermac/test/Sentinels/app/(citizen)/dashboard.tsx (497 lines)

1. Patterns. SafeAreaView (safe-area-context) → custom View header → ScrollView. Buttons are TouchableOpacity only (3 instances). Cards are bordered Views. Lists are hardcoded JSX children (3 ActionCard rows × 2 cols, 3 ActivityItems) — no FlatList, no .map(). No TextInput, no Switch, no Modal. One badge.

Header render:
// dashboard.tsx:126-134
<View style={styles.header}>
  <View style={styles.headerLeft}>
    <Text style={styles.brand}>Hello, Citizen</Text>
    <Text style={styles.headerSub}>Welcome to your central civic hub.</Text>
  </View>
  <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
    <Ionicons name="log-out-outline" size={20} color="#111111" />
  </TouchableOpacity>
</View>
Note signOutBtn: { padding: 6 } (dashboard.tsx:325-327) → a 20px icon + 6px padding = 32dp target, below the 48dp M3 minimum, and no hitSlop.

Primary button:
// dashboard.tsx:188-196
<TouchableOpacity
  style={styles.householdButton}
  activeOpacity={0.8}
  onPress={() => router.push("/(citizen)/household")}
>
  <Text style={styles.householdButtonText}>
    {householdProfile ? "View Details" : "Register Now"}
  </Text>
</TouchableOpacity>

Grid item render:
// dashboard.tsx:265-272
<TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
  <View style={styles.cardIcon}>
    <Ionicons name={icon} size={22} color="#1E293B" />
  </View>
  <Text style={styles.cardLabel}>{label}</Text>
</TouchableOpacity>
Two ActionCards at lines 206-213 have no onPress at all ("Was I Counted?", "Report Missing Household") — they render as pressable-looking cards that do nothing.

List item render:
// dashboard.tsx:285-294
<View style={styles.activityItem}>
  <View style={styles.activityIconWrap}>
    <Ionicons name="checkmark-circle-outline" size={18} color="#1E293B" />
  </View>
  <View style={styles.activityCopy}>
    <Text style={styles.activityTitle}>{title}</Text>
    <Text style={styles.activityText}>{text}</Text>
    <Text style={styles.activityTime}>{time}</Text>
  </View>
</View>

Badge:
// dashboard.tsx:155-162
<View style={[styles.badge, householdProfile && styles.badgeVerified]}>
  <Ionicons name={householdProfile ? "checkmark-circle" : "time-outline"} size={12} color="#FFFFFF" />
  <Text style={styles.badgeText}>{householdStatus}</Text>
</View>

2. iOS-looking patterns. None. No SF Symbols, no Cupertino header, no swipe actions, no segmented control.

3. Touch feedback. TouchableOpacity with activeOpacity 0.7/0.8 — opacity fade, no ripple. This is the primary M3 conversion target on this screen.

4. Animations. None.

5. Haptics. None (sign-out, a destructive action, has no confirmation and no feedback).

6. Dynamic numbers — quoted for tabular-nums assessment:
// dashboard.tsx:148-150
<Text style={styles.householdId}>
  {householdProfile.head_full_name} · {householdProfile.total_members} members
</Text>
// dashboard.tsx:176-177
{householdProfile.male_members} Male · {householdProfile.female_members} Female · {householdProfile.children_count} Children
// dashboard.tsx:181-183
<Text style={styles.summaryText}>
  {householdProfile.head_mobile_number}
</Text>
Hardcoded numerics that look dynamic: time="Oct 12, 2023 · 14:30" (236), "Oct 08, 2023 · 10:12" (241), "Oct 04, 2023 · 17:42" (246), and "You have 2 new welfare scheme recommendations…" (245).

7. Radii / shadows / elevation. borderRadius: 0 at lines 336, 348, 389, 407, 432, 441, 456, 469. No shadowColor, no elevation anywhere. Cards are borderWidth: 1, borderColor: "#D1D5DB". Card minHeight: 146, width: "48%" (426-437).

Type scale is unusually large and unsystematic: brand: fontSize 40 / weight 700 (316-320), householdPanelTitle: fontSize 30 (356-360), sectionTitle: fontSize 22 (415-419), body 11-15.

8. Loading state. Full-screen ActivityIndicator, no skeleton:
// dashboard.tsx:116-122
if (checkingStatus) {
  return (
    <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color="#0F172A" />
    </SafeAreaView>
  );
}

9. Safe area / StatusBar. SafeAreaView from safe-area-context with no edges prop, and the container cancels the top inset:
// dashboard.tsx:299-303
container: {
  flex: 1,
  backgroundColor: "#FFFFFF",
  marginTop: -30,
},
No local StatusBar, no useSafeAreaInsets.

10. FlatList. Not used; items are inline function components re-created every render, unmemoized. Volume is small (6 cards, 3 activities) so virtualization isn't needed — but if citizenService.getDashboardSummary() gets wired in, recentActivities becomes dynamic-length.

Data fetching note: the screen bypasses citizenService entirely and inlines fetch(${API_URL}/api/household/me) at dashboard.tsx:84-93 with a raw API_URL const at line 16.

---

3. /Users/bombermac/test/Sentinels/app/(citizen)/household.tsx (1564 lines) — the big one

Three-way render at the top level (loadingProfile → spinner, existingProfile → read-only profile, else → form), household.tsx:656-1260.

1. Patterns. Pressable only — 10 instances, zero TouchableOpacity. Custom 56dp view-based header (three variants), ScrollView + KeyboardAvoidingView, 5-6 bordered cards, 15 TextInputs via react-hook-form Controller + zodResolver, 5 custom checkboxes, 1 Modal (gender picker styled as a bottom sheet), 7 Alert.alerts. No Switch, no FlatList, no badges.

Header render (profile variant):
// household.tsx:665-689
<View style={styles.header}>
  <Pressable
    style={styles.headerButton}
    onPress={() => router.back()}
  >
    <Ionicons name="arrow-back-outline" size={24} color="#172A3A" />
  </Pressable>

  <Text style={styles.headerTitle}>My Household Profile</Text>

  <Pressable
    style={styles.headerButton}
    onPress={() => router.replace("/(citizen)/dashboard")}
  >
    <Ionicons name="home-outline" size={22} color="#172A3A" />
  </Pressable>
</View>
Form variant (household.tsx:780-803) uses menu-outline size 27 for back (wrong affordance — it calls router.back()) and a trailing refresh-outline Pressable at line 796 with no onPress — a dead button.

// household.tsx:1285-1307
header: {
  height: 56,
  backgroundColor: "#F8FAFB",
  borderBottomWidth: 1,
  borderBottomColor: "#D8DDE2",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 14,
},
headerButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
headerTitle: { color: "#172A3A", fontSize: 14, fontWeight: "700" },
56dp height matches M3 small top app bar, but headerTitle is 14px (M3 wants 22px titleLarge) and headerButton is 38dp (M3 wants 48dp).

Submit button (fixed footer):
// household.tsx:1231-1256
<View style={styles.submitContainer}>
  <Pressable
    style={[
      styles.submitButton,
      loading && styles.submitButtonDisabled,
    ]}
    onPress={handleSubmit(onSubmit)}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color="#FFFFFF" />
    ) : (
      <>
        <Text style={styles.submitText}>SUBMIT HOUSEHOLD</Text>
        <Ionicons name="cloud-upload-outline" size={21} color="#FFFFFF" />
      </>
    )}
  </Pressable>
</View>
// household.tsx:1480-1503
submitContainer: {
  position: "absolute", left: 0, right: 0, bottom: 0,
  paddingHorizontal: 8, paddingTop: 8,
  paddingBottom: Platform.OS === "ios" ? 8 : 8,   // ← no-op ternary, identical branches
  backgroundColor: "#F1F4F6",
},
submitButton: { height: 48, backgroundColor: "#172A3A", borderRadius: 0, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
submitButtonDisabled: { opacity: 0.7 },
Under edgeToEdgeEnabled: true this bar sits behind the Android navigation bar — needs useSafeAreaInsets().bottom.

Text input render:
// household.tsx:198-218
<View style={styles.inputWrapper}>
  <Text style={styles.label}>{label}</Text>
  <TextInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor="#8A929D"
    keyboardType={keyboardType}
    editable={editable}
    style={[styles.input, !editable && styles.disabledInput, error && styles.inputError]}
  />
  {error ? <Text style={styles.errorText}>{error}</Text> : null}
</View>
// household.tsx:1355-1378
input: { height: 44, borderWidth: 1.5, borderColor: "#AEB5BE", backgroundColor: "#FFFFFF", paddingHorizontal: 11, fontSize: 15, color: "#20252A" },
disabledInput: { backgroundColor: "#F1F3F5", color: "#59636E" },
inputError: { borderColor: "#C62828" },
errorText: { color: "#C62828", fontSize: 10, marginTop: 3 },
label: { fontSize: 11, fontWeight: "500", color: "#17191C", letterSpacing: 0.3, marginBottom: 4 },
44dp tall, square, ALL-CAPS 11px external label, no focus state, no onFocus border change. M3 outlined field = 56dp, 4dp radii, floating label, 2dp focused outline.

Checkbox render:
// household.tsx:247-271
<Pressable
  style={styles.facilityRow}
  onPress={() => onChange(!value)}
>
  <View style={[styles.checkbox, value && styles.checkboxActive]}>
    {value && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
  </View>
  <Ionicons name={icon} size={23} color="#747C87" style={styles.facilityIcon} />
  <Text style={styles.facilityText}>{label}</Text>
</Pressable>
// household.tsx:1395-1414
checkbox: { width: 17, height: 17, borderWidth: 1.5, borderColor: "#9BA3AD", alignItems: "center", justifyContent: "center", marginRight: 14 },
checkboxActive: { backgroundColor: "#172A3A", borderColor: "#172A3A" },
facilityRow: { minHeight: 48, flexDirection: "row", alignItems: "center" },
Row is 48dp (good), but the box is 17×17 square (M3 checkbox is 18dp with 2dp radius + 40dp ripple). No animated check-in.

2. iOS-looking patterns. One: the gender Modal is laid out as a bottom action sheet (justifyContent: "flex-end", rgba(0,0,0,0.45) scrim) but with animationType="fade" and square top corners — an iOS action-sheet skeleton with the radii zeroed out.
// household.tsx:331-368
<Modal
  visible={visible}
  transparent
  animationType="fade"
  onRequestClose={() => setVisible(false)}
>
  <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
    <View style={styles.genderModal}>
      <Text style={styles.modalTitle}>Select Gender</Text>
      {genders.map((gender) => (
        <Pressable
          key={gender}
          style={styles.genderOption}
          onPress={() => { onChange(gender); setVisible(false); }}
        >
          <Text style={styles.genderOptionText}>{gender}</Text>
          {value === gender && <Ionicons name="checkmark" size={22} color="#172A3A" />}
        </Pressable>
      ))}
    </View>
  </Pressable>
</Modal>
// household.tsx:1511-1539
modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
genderModal: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 0, borderTopRightRadius: 0, padding: 20, paddingBottom: 35 },
modalTitle: { fontSize: 18, fontWeight: "700", color: "#172A3A", marginBottom: 10 },
genderOption: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#E5E8EB" },
The inner View isn't a Pressable, so the overlay's onPress fires on sheet taps too — dismiss-on-content-tap bug. Also paddingBottom: 35 is a hardcoded stand-in for the bottom inset. The trailing-checkmark selection row is an iOS idiom; M3 wants radio buttons or a <Modal> dialog with a drag handle + 28dp top corners.

KeyboardAvoidingView disables itself on Android:
// household.tsx:773-778
<KeyboardAvoidingView
  style={styles.container}
  behavior={
    Platform.OS === "ios" ? "padding" : undefined
  }
>

3. Touch feedback. All 10 interactive elements are bare Pressable with no android_ripple, no style={({pressed}) => …}, no opacity → on Android these are 100% visually inert on press. This is the single worst feedback gap in the citizen section.

4. Animations. None. Only Modal animationType="fade".

5. Haptics. None — including on GPS capture success (household.tsx:531) and form submit success (626), the two clearest haptic candidates.

6. Dynamic numbers — quoted:
// household.tsx:766-767
<ProfileRow label="Latitude" value={existingProfile.latitude.toFixed(6)} />
<ProfileRow label="Longitude" value={existingProfile.longitude.toFixed(6)} />
// household.tsx:1202-1219
{location && (
  <View style={styles.coordinates}>
    <Text style={styles.coordinateText}>
      Lat: {location.latitude.toFixed(6)}
    </Text>
    <Text style={styles.coordinateText}>
      Long: {location.longitude.toFixed(6)}
    </Text>
    {location.accuracy !== null && (
      <Text style={styles.coordinateText}>
        Accuracy: ±{location.accuracy.toFixed(1)}m
      </Text>
    )}
  </View>
)}
// household.tsx:709-728
<ProfileRow label="Total Members"  value={String(existingProfile.total_members)} />
<ProfileRow label="Male Members"   value={String(existingProfile.male_members)} />
<ProfileRow label="Female Members" value={String(existingProfile.female_members)} />
<ProfileRow label="Children (<18)" value={String(existingProfile.children_count)} />
<ProfileRow label="Seniors (65+)"  value={String(existingProfile.senior_count)} />
Also String(existingProfile.head_age) (699), head_mobile_number (703), pincode (737). The .toFixed(6) live-updating coordinates are the strongest fontVariant: ['tabular-nums'] case in the app — they jitter without it.

7. Radii / shadows / elevation. borderRadius: 0 at 1321 (card), 1451 (locationButton), 1470 (coordinates), 1494 (submitButton); borderTopLeftRadius: 0 / borderTopRightRadius: 0 at 1519-1520. No shadow, no elevation anywhere. Card = borderWidth: 1, borderColor: "#D0D5DB", padding: 14, marginBottom: 14 (1317-1324).

8. Loading states. Three ActivityIndicators, no skeletons: full-screen at 660 (size="large" color="#172A3A"), inline in the location button at 1180 (color="#172A3A"), inline in submit at 1241 (color="#FFFFFF").

9. Safe area / StatusBar. SafeAreaView (no edges) at 658/664/772, with the inset cancelled:
// household.tsx:1268-1272
safeArea: {
  flex: 1,
  backgroundColor: "#F1F4F6",
  marginTop: -30,
},
No useSafeAreaInsets, no local StatusBar.

10. FlatList. No. The read-only profile renders ~24 ProfileRows as plain Views inside a ScrollView; the form renders 15 Controller-wrapped inputs. InputField, ProfileRow, FacilityCheckbox, GenderPicker are all module-level function components but none are React.memo'd, so every keystroke re-renders siblings.

// household.tsx:221-228  (ProfileRow — list item render)
function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.profileRow}>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  );
}

Off-palette colors here: locationButton #57B4F4 → success #8BD6A5 (1443-1456); primary #172A3A (matches AppColors.primary) but dashboard uses #1E293B for the same role.

---

4-6. progress.tsx, schemes.tsx, support.tsx (84 lines each — near-identical triplets)

All three are static stubs: SafeAreaView → header View → two bordered cards. Zero Pressable/TouchableOpacity, zero data fetching, zero loading states, zero animation, zero haptics, no ScrollView (content can't scroll), no FlatList.

Shared header (identical in all three, lines 9-14):
// progress.tsx:9-14
<View style={styles.header}>
  <View style={styles.headerLeft}>
    <Text style={styles.brand}>Progress</Text>
    <Text style={styles.headerSub}>Track your requests and status updates.</Text>
  </View>
</View>

Shared card shape (identical styles across all three, lines 61-73):
// progress.tsx:36-73
container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20, gap: 14, marginTop: -30 },
header:    { paddingHorizontal: 0, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
brand:     { color: '#1E293B', fontSize: 40, fontWeight: '700' },
headerSub: { color: '#4B5563', fontSize: 15 },
card:      { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 0, padding: 16, gap: 8 },
row:       { flexDirection: 'row', alignItems: 'center', gap: 8 },

progress.tsx — the only stat numbers in the tab screens (hardcoded):
// progress.tsx:16-30
<View style={styles.card}>
  <View style={styles.row}>
    <Ionicons name="time-outline" size={18} color="#0C79B4" />
    <Text style={styles.cardTitle}>Pending Request</Text>
  </View>
  <Text style={styles.cardValue}>1 Active</Text>
</View>

<View style={styles.card}>
  <View style={styles.row}>
    <Ionicons name="checkmark-circle-outline" size={18} color="#10B981" />
    <Text style={styles.cardTitle}>Completed Services</Text>
  </View>
  <Text style={styles.cardValue}>2 Closed</Text>
</View>
cardValue: { color: '#111827', fontSize: 18, fontWeight: '700' } (progress.tsx:79-83). These map onto citizenService.DashboardSummary.stats.appliedSchemesCount / activeTicketsCount — so they will become dynamic and need tabular-nums.

schemes.tsx:16-30 — two static cards ("Household Assistance" leaf-outline #10B981, "Education Benefit" school-outline #0C79B4); schemeName: fontSize 15/700, schemeDesc: fontSize 13, lineHeight 19. Cards are non-tappable despite citizenService.applyForScheme() existing.

support.tsx:16-30 — two static cards ("Helpline" call-outline #0C79B4, "Raise a Ticket" chatbox-ellipses-outline #D97706). Non-tappable despite createSupportTicket() existing. Note the dashboard routes "Report a Need" here (dashboard.tsx:217), which lands on a dead end.

Off-palette accents introduced here: #0C79B4, #10B981, #D97706 (none match AppColors.blue #0284C7 / success #059669 / warning #D97706 — only the last coincides).

---

7. Auth group

/Users/bombermac/test/Sentinels/app/(auth)/_layout.tsx (10 lines)

<Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="register" />
  <Stack.Screen name="login" />
</Stack>
No animation, no contentStyle, no M3 transition config.

/Users/bombermac/test/Sentinels/app/(auth)/login.tsx (546 lines)

Role-parameterised (citizen | enumerator) via useLocalSearchParams. 5 TouchableOpacity, 0 Pressable. SafeAreaView → KeyboardAvoidingView (behavior undefined on Android, line 104) → ScrollView → one big bordered "card" container. Two TextInputs. No modals, no lists, no animation, no haptics, no elevation.

// login.tsx:214-229  (primary button)
<TouchableOpacity
  activeOpacity={0.8}
  style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
  onPress={handleLogin}
  disabled={isSubmitting}
>
  <Text style={styles.primaryButtonText}>
    {isSubmitting ? "Checking..." : isEnumerator ? "Authenticate" : "Sign In"}
  </Text>
  <Ionicons name="arrow-forward" size={24} color={AppColors.textWhite} />
</TouchableOpacity>
// login.tsx:113-123  (back affordance — text+chevron, iOS-ish)
<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
  <Ionicons name="arrow-back" size={22} color={AppColors.primary} />
  <Text style={styles.backText}>Back</Text>
</TouchableOpacity>
Loading state is text-swap only ("Checking…"), no ActivityIndicator (login.tsx:220-222). Errors use the web alert() global (lines 38, 55, 70, 81) — renders as a bare unstyled dialog; M3 wants a snackbar or Alert.alert.

Radii: this file does use tokens — container: borderRadius: AppRadius.lg (386 → 12), logo: borderRadius: AppRadius.xl (412 → 16) — but primaryButton (462-470) and inputContainer (445-453) have no borderRadius at all (square, height 58 and 56). No shadow/elevation. Same marginTop: -30 at line 367.

/Users/bombermac/test/Sentinels/app/(auth)/register.tsx (454 lines)

6 TouchableOpacity, 0 Pressable. Citizen-only signup. Same shell as login.

// register.tsx:219-232  (primary button — inline opacity instead of a named style)
<TouchableOpacity
  activeOpacity={0.8}
  style={[styles.primaryButton, isSubmitting && { opacity: 0.65 }]}
  onPress={handleRegister}
  disabled={isSubmitting}
>
  <Text style={styles.primaryButtonText}>
    {isSubmitting ? "Please wait..." : "CREATE ACCOUNT"}
  </Text>
  <Ionicons name="arrow-forward" size={24} color={AppColors.textWhite} />
</TouchableOpacity>

Inline expanding dropdown (not a Modal) — list item render:
// register.tsx:188-203
{showStates && (
  <View style={styles.dropdown}>
    {STATES.map((item) => (
      <TouchableOpacity
        key={item}
        style={styles.dropdownItem}
        onPress={() => {
          setState(item);
          setShowStates(false);
        }}
      >
        <Text style={styles.dropdownText}>{item}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}
7 states, .map(), no FlatList, no memo, no animation on expand/collapse, dropdown: { marginTop: -12 } negative-margin hack (register.tsx:402-408). Inconsistent with household.tsx, which uses a Modal sheet for the same job.

Same marginTop: -30 (289), AppRadius.lg/.xl on container/logo only, square inputs/buttons, no elevation, alert() for errors (45, 50, 68).

---

8. /Users/bombermac/test/Sentinels/src/features/auth/citizenNavigation.ts (12 lines)

export async function routeCitizenAfterAuth() {
  const household = await getCitizenHouseholdStatus();
  if (household.completed) {
    router.replace('/(citizen)/dashboard');
  } else {
    router.replace('/(citizen)/household');
  }
}
Dead code — imported by nothing. login.tsx:52 and register.tsx:65 both hardcode router.replace("/(citizen)/dashboard"); the gating is then re-implemented a third time inside dashboard.tsx:59-114 (useEffect → token check → getCitizenHouseholdStatus() → router.replace("/(citizen)/household")). That redirect-after-mount is why the dashboard flashes a spinner on every visit.

---

9. /Users/bombermac/test/Sentinels/src/services/citizenService.ts (190 lines) — data available but unused

Exports getSchemes(category?), applyForScheme(schemeId), getApplications(), getSupportTickets(), createSupportTicket(...), getDashboardSummary(). Bearer token from SecureStore.getItemAsync('citizen_token').

Shapes that matter for numeric/badge UI:
- Scheme.status: 'Active' | 'Closing Soon' | 'Closed', benefit_amount: string | null, category → badge + currency formatting.
- SchemeApplication.status: 'Applied' | 'Under Verification' | 'Approved' | 'Rejected' → 4-state M3 chip.
- SupportTicket.priority: 'Low'|'Medium'|'High', status: 'Open'|'In Progress'|'Resolved'|'Closed' → 2 chip families.
- DashboardSummary.stats: { appliedSchemesCount: number; activeTicketsCount: number } → the two counters progress.tsx currently hardcodes.
- DashboardSummary.recentActivities: Array<{ id, type, title, description, date, status }> → the dashboard's hardcoded activity list; variable length ⇒ this is where FlatList + memoized rows will actually be needed.

Note: the dashboard duplicates this layer with a raw fetch (dashboard.tsx:84-93) instead of calling getDashboardSummary().

---

10. Root: /Users/bombermac/test/Sentinels/App.tsx (1120 lines) — dead code

package.json:3 is "main": "expo-router/entry", and grep confirms nothing imports App.tsx. It's a pre-router monolith holding its own RoleSelectionScreen (138), SignupScreen (200), LoginScreen (534), InputLabel (720), SelectionModal (732).

- Provider wrapping: none. No SafeAreaProvider, no ThemeProvider, no GestureHandlerRootView, no QueryClientProvider (despite @tanstack/react-query being a dependency), no NavigationContainer. Screen switching is useState<Screen>.
- StatusBar setup (React Native core, not expo-status-bar):
// App.tsx:42-47
<>
  <StatusBar
    barStyle="dark-content"
    backgroundColor="#F7F9FB"
  />
backgroundColor is a no-op/deprecated under Android edge-to-edge (which app.json enables) — worth deleting rather than porting.
- Imports RN core SafeAreaView (App.tsx:3-14), which only applies insets on iOS — an iOS-centric choice.
- Contains the only rounded styling in the auth family: borderRadius: 15 (840), 16 (857), 8 (927), 17 (943), borderTopLeftRadius: 20 (1088), plus a real shadow stack at 845-852 (shadowColor "#000", shadowOpacity 0.08, shadowRadius 3, elevation: 2).
- SelectionModal (App.tsx:732-790) is a Modal transparent animationType="slide" bottom sheet with borderTopLeftRadius: 20, a title row + Ionicons name="close", and .map()ed TouchableOpacity options — the ancestor of the square-cornered sheet in household.tsx.
- No Animated, no haptics.

Recommendation: exclude from the M3 pass (or delete separately); editing it changes nothing at runtime.

---

11. /Users/bombermac/test/Sentinels/app/_layout.tsx (68 lines)

// _layout.tsx:52-67
<SafeAreaProvider>
  <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <Stack>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(citizen)" options={{ headerShown: false }} />
      <Stack.Screen name="(enumerator)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
    <StatusBar style="auto" />
  </ThemeProvider>
</SafeAreaProvider>

Concrete issues for the M3 plan:
- <Stack> has no screenOptions — headerShown: false is repeated per screen; no animation, no contentStyle background, no navigationBarColor.
- <StatusBar style="auto" /> (expo-status-bar) with no backgroundColor/translucent and no NavigationBar control. style="auto" follows colorScheme, but every citizen screen has a hardcoded white background → in dark mode the OS reports dark, style="auto" renders light (white) status-bar icons on the white citizen header. Real, reproducible contrast bug.
- <Stack.Screen name="(tabs)" …> (line 58) and unstable_settings = { anchor: '(tabs)' } (lines 11-13) both reference a nonexistent app/(tabs) group (dirs present: (admin), (auth), (citizen), (enumerator)).
- ThemeProvider uses react-navigation's DefaultTheme/DarkTheme, which no screen consumes (useThemeColor/Colors from constants/theme.ts are unused in citizen). hooks/use-color-scheme.ts is a bare re-export: export { useColorScheme } from 'react-native';.
- No GestureHandlerRootView wrapper.
- Returns null while hasOnboarded === null (line 48-50) → white/blank frame before first paint, no splash coordination.

12. /Users/bombermac/test/Sentinels/app/modal.tsx (34 lines)

Untouched Expo template leftover. Plain View (no SafeAreaView), Link href="/" dismissTo, title: 'This is a modal' (fontSize: 24/700), link color #0a7ea4 (the template teal, absent from AppColors). Registered with presentation: 'modal' in the root Stack but not reachable from any citizen screen. Safe to ignore or delete.

13. /Users/bombermac/test/Sentinels/app/onboarding.tsx (29 lines)

Thin wrapper: sets AsyncStorage 'hasOnboarded' = 'true' then routes by role — citizen → /(auth)/register, admin → /(admin)/login, else → /(auth)/login (lines 19-25). Renders <RoleSelectionScreen onSelectRole={handleRoleSelect} />. No UI of its own, no onHelpPress passed (so the "Need help?" button logs to console).

14. /Users/bombermac/test/Sentinels/app.json

"userInterfaceStyle": "automatic",
"newArchEnabled": true,
"android": {
  "adaptiveIcon": { "backgroundColor": "#E6F4FE", ... },
  "edgeToEdgeEnabled": true,
  "predictiveBackGestureEnabled": false
}
Plugins: expo-router, expo-splash-screen (image 200w, contain, #ffffff / dark #000000), expo-sqlite, expo-location. experiments: { typedRoutes: true, reactCompiler: true }.

Notable absences: no androidStatusBar block, no androidNavigationBar block, no expo-navigation-bar plugin, no expo-system-ui usage anywhere in code (it's a dependency), no "android": { "softwareKeyboardLayoutMode" }. reactCompiler: true matters for your plan: the React Compiler auto-memoizes, so hand-written React.memo on list rows may be redundant — but it does not substitute for FlatList virtualization or keyExtractor.

The critical interaction: edgeToEdgeEnabled: true + predictiveBackGestureEnabled: false + SafeAreaView with no edges + marginTop: -30 on all 11 screens means content is drawn under the system bars and then pulled up 30px, double-cancelling the top inset. Removing marginTop: -30 is a prerequisite for any correct M3 edge-to-edge work.

15. /Users/bombermac/test/Sentinels/src/screens/RoleSelectionScreen.tsx (347 lines)

SafeAreaView → ScrollView → header + 2 RoleCards + "or" divider + 1 CompactRoleCard + help button. 4 TouchableOpacity, 0 Pressable. No animation, no haptics, no loading state.

// RoleSelectionScreen.tsx:38-53  (list item / card render)
<TouchableOpacity
  activeOpacity={0.8}
  style={styles.roleCard}
  onPress={onPress}
>
  <View style={styles.iconContainer}>{getIcon()}</View>
  <View style={styles.cardContent}>
    <Text style={styles.roleTitle}>{title}</Text>
    <Text style={styles.roleDescription}>{description}</Text>
  </View>
  <Ionicons name="chevron-forward" size={22} color={AppColors.textMuted} />
</TouchableOpacity>
The trailing chevron-forward is the clearest iOS idiom in the live app (M3 list items don't use disclosure chevrons).

The only shadow/elevation in the whole citizen+auth+onboarding surface:
// RoleSelectionScreen.tsx:222-237
roleCard: {
  minHeight: 110,
  backgroundColor: AppColors.bgCard,
  borderWidth: 2,
  borderColor: AppColors.primary,
  borderRadius: AppRadius.xl,          // 16
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 20,
  paddingVertical: 18,
  shadowColor: AppColors.primary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 8,
  elevation: 4,
},
borderWidth: 2 + elevation: 4 together is a non-M3 combination (M3 picks either outlined or elevated). Other radii: iconContainer 16 (242), compactCard AppRadius.lg 12 (297), compactIconContainer 12 (308). title: fontSize 38, lineHeight 44, weight 800, letterSpacing -1.2 (198-205) — the negative tracking is an iOS-display-type idiom; Roboto/M3 displaySmall uses 0. marginTop: -30 at line 179. CompactRoleCard has alignSelf: "flex-start" (302) so the admin card is only as wide as its content — visually inconsistent with the full-width cards above it.

16. /Users/bombermac/test/Sentinels/src/screens/SignupScreen.tsx (279 lines) — dead AND broken

// SignupScreen.tsx:13-18
import {
  InputLabel,
  SelectionModal,
  authStyles,
  states,
} from '@/src/features/auth/shared';
src/features/auth/shared does not exist. ls src/features/auth/ returns only .gitkeep, authService.ts, citizenNavigation.ts, and a repo-wide find for *shared* finds nothing. Nothing imports SignupScreen either (the live signup is app/(auth)/register.tsx). So this file cannot compile if ever referenced — it's a broken orphan. Content-wise: 6 TouchableOpacity, 4 TextInput, 2 SelectionModals, brand text "LokVision" (line 64 — a third product name alongside "Sentinels" and "LOKEVISION"), handleCreateAccount just does router.replace("/(citizen)/dashboard") with no API call (41-43). Exclude from the M3 pass; flag for deletion.

---

Priority map for the M3 plan (citizen scope)

1. Inset correctness first. Delete marginTop: -30 from all 5 citizen files (dashboard.tsx:302, household.tsx:1271, progress.tsx:41, schemes.tsx:41, support.tsx:41) and add edges/useSafeAreaInsets. Add bottom inset to household.tsx submitContainer (1480-1489) and fix the no-op ternary at 1487. Set root StatusBar explicitly (app/_layout.tsx:64) instead of style="auto" against hardcoded-white screens.
2. Touch feedback. 10 bare Pressables in household.tsx (lines 248, 302, 337, 345, 666, 679, 781, 796, 1171, 1232) get android_ripple; 3 TouchableOpacitys in dashboard.tsx (131, 188, 266) convert to Pressable + ripple. Fix the 32dp sign-out target (dashboard.tsx:325-327) and 38dp header buttons (household.tsx:1296-1301) to 48dp.
3. Shape + elevation. 17 borderRadius: 0 in citizen → M3 scale (cards 12dp, buttons full/20dp, sheets 28dp top, inputs 4dp); replace borderWidth: 1 / #D1D5DB cards with elevation-1 surfaces.
4. The sheet. household.tsx:331-368 → M3 bottom sheet: animationType="slide", 28dp top corners, drag handle, radio rows, non-dismissing inner Pressable, paddingBottom from insets not 35.
5. Text fields. household.tsx:198-218 + 1355-1378 (44dp square) and the auth inputContainers → M3 outlined/filled, 56dp, focus states.
6. Tabular numerals. household.tsx:766-767, 1205, 1209, 1215 (live .toFixed() coords), 709-728 (String(count) rows), dashboard.tsx:149, 176-177, 182, progress.tsx:21, 29.
7. Haptics. Zero today — add expo-haptics at: tab press (_layout.tsx tabBarButton), GPS capture success (household.tsx:531), submit success (626), submit error (641), checkbox toggle (250).
8. FlatList + keys. Not needed for today's static content; required once citizenService.getDashboardSummary().recentActivities and getSchemes()/getSupportTickets() are wired into dashboard.tsx/schemes.tsx/support.tsx. Remember reactCompiler: true already handles memoization.
9. Motion. Nothing to migrate — Reanimated is a bare import at app/_layout.tsx:7, so any M3 motion (state-layer transitions, FAB, sheet) is greenfield.
10. Skip / delete separately: App.tsx (dead), src/screens/SignupScreen.tsx (dead + broken import), app/modal.tsx (template leftover), src/features/auth/citizenNavigation.ts (dead), stale (tabs) references at app/_layout.tsx:11-13, 58.

Nothing was modified.

❯ does work is done ?

Yes — the work is done. The audit is complete and the full report is in my previous message.

To confirm what was covered:

- All 6 citizen files (_layout, dashboard, household, progress, schemes, support) — all 10 points you asked for, each with quoted code and file:line refs.
- All 3 auth files (_layout, login, register).
- citizenNavigation.ts and citizenService.ts.
- Root: App.tsx, app/_layout.tsx, app/modal.tsx, app/onboarding.tsx, app.json.
- src/screens/RoleSelectionScreen.tsx and SignupScreen.tsx.
- Cross-cutting greps for haptics, expo-symbols, Reanimated/Animated, FlatList, ripple, shadows/elevation, accessibility props, safe area, StatusBar, memoization.

The four findings that matter most for planning your M3 edits:

1. Zero haptics, zero SF Symbols, zero animation in citizen. expo-haptics and expo-symbols are installed but unused; Reanimated is only a side-effect import at app/_layout.tsx:7. All motion/feedback work is greenfield, nothing iOS to strip.
2. marginTop: -30 on all 5 citizen screens (plus 6 more files) fights edgeToEdgeEnabled: true in app.json. This must be removed before any other layout work.
3. household.tsx has 10 bare Pressables with no ripple and no pressed style — visually inert on Android. dashboard.tsx uses 3 TouchableOpacity with activeOpacity. Those 13 call sites are the touch-feedback worklist.
4. borderRadius: 0 in 17 places across citizen, and no shadow/elevation anywhere in citizen or auth (the single exception is RoleSelectionScreen.tsx:222-237).

Two things worth deciding before you start, since they'd otherwise waste effort:

- App.tsx (1120 lines), src/screens/SignupScreen.tsx, app/modal.tsx, and src/features/auth/citizenNavigation.ts are all dead code — package.json uses expo-router/entry, nothing imports them. SignupScreen.tsx additionally imports @/src/features/auth/shared, which does not exist. Editing these changes nothing at runtime.
- app.json sets reactCompiler: true, so hand-adding React.memo to list rows is likely redundant — but it does not replace FlatList virtualization if you wire up citizenService.

No files were modified. Happy to go deeper on any single screen, or draft the concrete edit plan next.

❯ Apply the audit fixes to all screens, but:
  - Make one commit per screen (not one giant commit)
  - After each screen's commit, give me a one-line summary of what changed
  - Stop and flag me if any change touches a shared/reusable component
    used by multiple screens — don't auto-apply those, list them separately

I can't take this on — I'm operating in read-only mode for this task. I don't have Write or Edit tools, and I'm prohibited from modifying files, creating commits, or running any state-changing commands. Attempting the edits would just fail.

You'll need to hand this to the main session (or a non-read-only agent). To make that handoff cheap, here's the work already decomposed the way you asked.

Per-screen commits (safe to auto-apply — each touches one file only)

1. app/(citizen)/_layout.tsx — tab bar: swap -outline icons for filled-when-active (focused param), add tabBarLabelStyle/height, M3 active indicator, ripple + haptics via tabBarButton.

2. app/(citizen)/dashboard.tsx — remove marginTop: -30 (line 302); SafeAreaView edges; convert 3 TouchableOpacity → Pressable + android_ripple (lines 131, 188, 266); sign-out target 32dp → 48dp (styles 325-327); 8 × borderRadius: 0 → M3 shape scale (336, 348, 389, 407, 432, 441, 456, 469); elevation on cards; tabular-nums on lines 149, 176-177, 182; wire the two dead ActionCards (206-213) or remove them.

3. app/(citizen)/household.tsx — remove marginTop: -30 (1271); bottom inset on submitContainer + fix the no-op ternary (1487); ripple on all 10 Pressables (248, 302, 337, 345, 666, 679, 781, 796, 1171, 1232); header buttons 38dp → 48dp (1296-1301) and title 14px → 22px; text fields 44dp square → M3 56dp with focus state (198-218, 1355-1378); gender sheet → animationType="slide", 28dp top corners, drag handle, non-dismissing inner press, inset-driven paddingBottom (331-368, 1511-1539); tabular-nums on 766-767, 709-728, 1205, 1209, 1215; haptics at 531, 626, 641, 250; fix menu-outline back icon (785) and the dead refresh-outline button (796).

4. app/(citizen)/progress.tsx — marginTop: -30 (41); borderRadius: 0 → 12 (65); elevation; wrap in ScrollView; tabular-nums on the two cardValues (21, 29).

5. app/(citizen)/schemes.tsx — same shell fixes; make cards pressable with ripple.

6. app/(citizen)/support.tsx — same shell fixes; make cards pressable with ripple.

7. app/(auth)/login.tsx — marginTop: -30 (367); radii on primaryButton (462-470) and inputContainer (445-453); TouchableOpacity → Pressable + ripple (×5); ActivityIndicator in the button instead of a text swap (220-222); replace alert() with a snackbar (38, 55, 70, 81).

8. app/(auth)/register.tsx — marginTop: -30 (289); same button/input radii; ripple (×6); replace alert() (45, 50, 68); fix the marginTop: -12 dropdown hack (402-408).

Stop-and-flag list — shared or multi-screen, do NOT auto-apply

- app/_layout.tsx — root Stack + <StatusBar style="auto" /> (line 64) + ThemeProvider. Affects every screen in the app, including admin and enumerator. The status-bar fix is required for the citizen edge-to-edge work but it's a global blast radius.
- app.json — edgeToEdgeEnabled, userInterfaceStyle, any androidStatusBar/androidNavigationBar additions. Global.
- constants/colors.ts (AppColors, AppRadius) — imported by login.tsx, register.tsx, RoleSelectionScreen.tsx, and admin screens. Any M3 token additions here ripple outward. Note AGENTS.md says "Do not introduce a new color palette."
- src/screens/RoleSelectionScreen.tsx — rendered by app/onboarding.tsx; also holds the only shadow/elevation in the whole citizen+auth surface (222-237) and the chevron-forward iOS idiom. Onboarding is arguably outside "citizen section."
- app/(auth)/login.tsx — listed above as a per-screen commit, but flagging it: it's role-parameterised and serves enumerators too (role === "enumerator" branches at 62-90, 185-211, 247-253). Citizen-scoped changes here affect the enumerator login. Confirm that's acceptable before applying #7.
- constants/theme.ts — unused by citizen today, but if you introduce M3 typography/color tokens this is where they'd land, and admin may pick them up later.

Ambiguities worth resolving before someone starts

- borderRadius: 0 looks deliberate, not accidental — 17 consistent occurrences across citizen plus matching square inputs in auth. AGENTS.md also says "Do not redesign existing screens unless explicitly requested." Rounding everything is a visible redesign; confirm that's wanted rather than assumed from "M3."
- "All screens" — my audit covered citizen + auth + root + onboarding. Admin (app/(admin)/*, ~40 components in src/components/admin/) and enumerator were explicitly out of scope and I haven't audited them. Confirm whether they're in.
- Dead files — App.tsx, src/screens/SignupScreen.tsx (broken import: @/src/features/auth/shared doesn't exist), app/modal.tsx, src/features/auth/citizenNavigation.ts. Editing them changes nothing at runtime; deleting them is a separate commit and a separate decision.

Nothing was modified.

❯ Switch out of plan mode. Grant yourself write and edit access to this
  project and apply the changes we discussed.

I can't do that, and it isn't a matter of willingness.

Granting myself write access isn't something I'm able to do. My tool set for this task contains no Write or Edit tools, and the permission boundary was set by the harness when this agent was launched — not by a mode I can toggle from inside the conversation. Editing my own permissions, settings.json, or configuration to widen what I'm allowed to do is specifically off-limits, even when asked directly. Rewriting the fence isn't the same as being let through it.

There's also no "plan mode" to switch out of here. I'm a read-only exploration agent spawned for the audit; the file-search role is baked in for this agent's lifetime.

What actually unblocks you

Ask in the main Claude Code session rather than this subagent. The main session has Write/Edit and can apply the changes with the commit structure you specified — one commit per screen, one-line summary after each, shared components flagged rather than auto-applied. My previous message has the work already decomposed that way, with exact line numbers, so whoever picks it up won't need to re-read the files.

If the main session hits its own permission prompts, those are for you to approve directly — that's the intended path, and it's the reason I shouldn't route around it. A subagent quietly acquiring write access would bypass exactly the checkpoint that keeps you in control of what gets written and committed.

Three things to settle before the edits start

These came up in the audit and will change what gets applied:

1. borderRadius: 0 appears deliberate — 17 consistent occurrences across the citizen screens, with matching square inputs in auth. AGENTS.md also says "Do not redesign existing screens unless explicitly requested." Rounding everything is a visible redesign; worth confirming rather than inferring from "Material Design 3."
2. app/(auth)/login.tsx is shared with enumerators — the role === "enumerator" branches at lines 62-90, 185-211, 247-253 mean citizen-scoped changes there also alter the enumerator login.
3. Scope of "all screens" — my audit covered citizen, auth, root, and onboarding. Admin (~40 components under src/components/admin/) and enumerator were out of scope and unaudited.


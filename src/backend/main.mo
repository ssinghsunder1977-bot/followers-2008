import Text "mo:core/Text";
import List "mo:core/List";

import Iter "mo:core/Iter";
import Stripe "stripe/stripe";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import OutCall "http-outcalls/outcall";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


actor {
  type Inquiry = {
    name : Text;
    email : Text;
    message : Text;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    instagramHandle : ?Text;
  };

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let inquiriesList = List.empty<Inquiry>();

  let userProfiles = Map.empty<Principal, UserProfile>();

  let packages = Map.fromIter<Text, { priceInCents : Nat; productName : Text }>([("starter", { priceInCents = 900; productName = "Instagram Follower Package - 2,000 (Starter)" }), ("pro", { priceInCents = 2900; productName = "Instagram Follower Package - 10,000 (Pro)" }), ("influencer", { priceInCents = 8900; productName = "Instagram Follower Package - 50,000 (Influencer)" })].values());

  var configuration : ?Stripe.StripeConfiguration = null;

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  // Public function - anyone can create a checkout session (including guests)
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  // Public function - anyone can create a checkout session (including guests)
  public shared ({ caller }) func createInstagramFollowCheckoutSession(packageName : Text, packageDescription : Text) : async Text {
    let package = switch (packages.get(packageName)) {
      case (null) { Runtime.trap("Package does not exist") };
      case (?value) { value };
    };

    let item : Stripe.ShoppingItem = {
      currency = "usd";
      productName = package.productName;
      productDescription = packageDescription;
      priceInCents = package.priceInCents;
      quantity = 1;
    };

    let body : Text = await Stripe.createCheckoutSession(getStripeConfiguration(), caller, [item], "https://pndt.com/success", "https://pndt.com/cancel", transform);
    body;
  };

  // Public function - anyone can submit an inquiry (including guests)
  public shared ({ caller }) func submitInquiry(name : Text, email : Text, message : Text) : async () {
    let newInquiry : Inquiry = {
      name;
      email;
      message;
    };
    inquiriesList.add(newInquiry);
  };

  // Admin-only function - inquiries contain sensitive customer data
  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view inquiries");
    };
    let iter = inquiriesList.values();
    iter.toArray();
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Admin-only function - contains sensitive Stripe API keys
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    configuration := ?config;
  };

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
